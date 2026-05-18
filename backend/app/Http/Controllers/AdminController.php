<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    private function adminGuard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || $u->user_type !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Admin access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        return null;
    }

    private function addNote(string $type, int $targetId, string $note): void
    {
        DB::table('admin_notes')->insert([
            'admin_id' => Auth::id(),
            'target_type' => $type,
            'target_id' => $targetId,
            'note' => $note,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function updateSetting(string $key, $newValue): void
    {
        $old = DB::table('platform_settings')->where('key', $key)->value('value');

        DB::table('platform_settings')->updateOrInsert(
            ['key' => $key],
            ['value' => json_encode($newValue), 'updated_at' => now(), 'created_at' => now()]
        );

        DB::table('settings_audit_logs')->insert([
            'admin_id' => Auth::id(),
            'setting_key' => $key,
            'old_value' => $old,
            'new_value' => json_encode($newValue),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    // Auth & admin account
    public function me(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Admin profile retrieved', 'data' => Auth::user()]);
    }

    public function changeMyPassword(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed|different:current_password',
        ]);

        $u = Auth::user();
        if (!Hash::check($validated['current_password'], $u->password)) {
            return response()->json(['success' => false, 'message' => 'Current password is incorrect', 'code' => 'INVALID_PASSWORD'], 401);
        }

        $u->update(['password' => Hash::make($validated['password'])]);
        $u->tokens()->delete();

        return response()->json(['success' => true, 'message' => 'Admin password changed', 'data' => null]);
    }

    // Trainer management
    public function trainers(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }

        $q = DB::table('users')->where('user_type', 'trainer');
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $q->where('is_active', 1);
            } elseif ($request->status === 'suspended') {
                $q->where('is_active', 0);
            } elseif ($request->status === 'pending') {
                $q->where('is_approved', 0);
            }
        }

        return response()->json(['success' => true, 'message' => 'Trainers retrieved', 'data' => $q->orderByDesc('id')->paginate(20)]);
    }

    public function trainer(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }

        $trainer = DB::table('users')->where('id', $id)->where('user_type', 'trainer')->first();
        if (!$trainer) {
            return response()->json(['success' => false, 'message' => 'Trainer not found', 'code' => 'NOT_FOUND'], 404);
        }

        $stats = [
            'events' => DB::table('events')->where('user_id', $id)->count(),
            'bookings' => DB::table('bookings')->where('trainer_id', $id)->count(),
            'avg_rating' => round((float) DB::table('reviews')->where('trainer_id', $id)->avg('rating'), 2),
        ];

        return response()->json(['success' => true, 'message' => 'Trainer detail retrieved', 'data' => ['trainer' => $trainer, 'stats' => $stats]]);
    }

    public function pendingTrainers(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Pending trainers retrieved', 'data' => DB::table('users')->where('user_type', 'trainer')->where('is_approved', 0)->paginate(20)]);
    }

    public function approveTrainer(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'trainer')->update(['is_approved' => 1, 'is_active' => 1, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Trainer approved', 'data' => null]);
    }

    public function suspendTrainer(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'trainer')->update(['is_active' => 0, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Trainer suspended', 'data' => null]);
    }

    public function reinstateTrainer(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'trainer')->update(['is_active' => 1, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Trainer reinstated', 'data' => null]);
    }

    public function deleteTrainer(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'trainer')->delete();
        return response()->json(['success' => true, 'message' => 'Trainer deleted', 'data' => null]);
    }

    public function noteTrainer(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['note' => 'required|string|max:3000']);
        $this->addNote('trainer', $id, $validated['note']);
        return response()->json(['success' => true, 'message' => 'Trainer note added', 'data' => null], 201);
    }

    // Student management
    public function students(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $q = DB::table('users')->where('user_type', 'student');
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $q->where('is_active', 1);
            } elseif ($request->status === 'suspended') {
                $q->where('is_active', 0);
            }
        }
        return response()->json(['success' => true, 'message' => 'Students retrieved', 'data' => $q->orderByDesc('id')->paginate(20)]);
    }

    public function student(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $student = DB::table('users')->where('id', $id)->where('user_type', 'student')->first();
        if (!$student) {
            return response()->json(['success' => false, 'message' => 'Student not found', 'code' => 'NOT_FOUND'], 404);
        }
        $history = DB::table('bookings')->where('student_id', $id)->orderByDesc('id')->limit(10)->get();
        return response()->json(['success' => true, 'message' => 'Student detail retrieved', 'data' => ['student' => $student, 'booking_history' => $history]]);
    }

    public function suspendStudent(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'student')->update(['is_active' => 0, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Student suspended', 'data' => null]);
    }

    public function reinstateStudent(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'student')->update(['is_active' => 1, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Student reinstated', 'data' => null]);
    }

    public function deleteStudent(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('users')->where('id', $id)->where('user_type', 'student')->delete();
        return response()->json(['success' => true, 'message' => 'Student deleted', 'data' => null]);
    }

    public function noteStudent(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['note' => 'required|string|max:3000']);
        $this->addNote('student', $id, $validated['note']);
        return response()->json(['success' => true, 'message' => 'Student note added', 'data' => null], 201);
    }

    // Event management
    public function events(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $q = DB::table('events');
        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }
        if ($request->filled('category')) {
            $q->where('category', $request->category);
        }
        if ($request->filled('trainer_id')) {
            $q->where('user_id', $request->trainer_id);
        }
        return response()->json(['success' => true, 'message' => 'Events retrieved', 'data' => $q->orderByDesc('id')->paginate(20)]);
    }

    public function event(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $event = DB::table('events')->where('id', $id)->first();
        if (!$event) {
            return response()->json(['success' => false, 'message' => 'Event not found', 'code' => 'NOT_FOUND'], 404);
        }
        $stats = [
            'bookings' => DB::table('bookings')->where('event_id', $id)->count(),
            'completed_bookings' => DB::table('bookings')->where('event_id', $id)->where('status', 'completed')->count(),
            'avg_rating' => round((float) DB::table('reviews')->where('event_id', $id)->avg('rating'), 2),
        ];
        return response()->json(['success' => true, 'message' => 'Event detail retrieved', 'data' => ['event' => $event, 'stats' => $stats]]);
    }

    public function unpublishEvent(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('events')->where('id', $id)->update(['status' => 'draft', 'published_at' => null, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Event unpublished', 'data' => null]);
    }

    public function publishEvent(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('events')->where('id', $id)->update(['status' => 'published', 'published_at' => now(), 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Event published', 'data' => null]);
    }

    public function flagEvent(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['reason' => 'nullable|string|max:3000']);
        DB::table('events')->where('id', $id)->update(['is_flagged' => 1, 'flag_reason' => $validated['reason'] ?? null, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Event flagged', 'data' => null]);
    }

    public function deleteEvent(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('events')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Event deleted', 'data' => null]);
    }

    public function flaggedEvents(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Flagged events retrieved', 'data' => DB::table('events')->where('is_flagged', 1)->orderByDesc('id')->paginate(20)]);
    }

    // Booking oversight
    public function bookings(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $q = DB::table('bookings');
        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }
        if ($request->filled('trainer_id')) {
            $q->where('trainer_id', $request->trainer_id);
        }
        return response()->json(['success' => true, 'message' => 'Bookings retrieved', 'data' => $q->orderByDesc('id')->paginate(20)]);
    }

    public function booking(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $booking = DB::table('bookings')->where('id', $id)->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }
        return response()->json(['success' => true, 'message' => 'Booking detail retrieved', 'data' => $booking]);
    }

    public function disputedBookings(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Disputed bookings retrieved', 'data' => DB::table('bookings')->where('is_disputed', 1)->orderByDesc('id')->paginate(20)]);
    }

    public function cancelBooking(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $request->validate(['reason' => 'nullable|string|max:2000']);
        DB::table('bookings')->where('id', $id)->update(['status' => 'cancelled', 'cancel_reason' => $request->reason, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Booking cancelled', 'data' => null]);
    }

    public function completeBooking(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('bookings')->where('id', $id)->update(['status' => 'completed', 'completed_at' => now(), 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Booking completed', 'data' => null]);
    }

    public function noteBooking(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['note' => 'required|string|max:3000']);
        DB::table('bookings')->where('id', $id)->update(['admin_note' => $validated['note'], 'updated_at' => now()]);
        $this->addNote('booking', $id, $validated['note']);
        return response()->json(['success' => true, 'message' => 'Booking note added', 'data' => null], 201);
    }

    // Payments & finance
    public function payments(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $q = DB::table('payments');
        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }
        return response()->json(['success' => true, 'message' => 'Payments retrieved', 'data' => $q->orderByDesc('id')->paginate(20)]);
    }

    public function payment(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $payment = DB::table('payments')->where('id', $id)->first();
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found', 'code' => 'NOT_FOUND'], 404);
        }
        return response()->json(['success' => true, 'message' => 'Payment detail retrieved', 'data' => $payment]);
    }

    public function refundPayment(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['amount_bdt' => 'nullable|integer|min:1', 'reason' => 'nullable|string|max:2000']);
        $payment = DB::table('payments')->where('id', $id)->first();
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found', 'code' => 'NOT_FOUND'], 404);
        }
        DB::table('payments')->where('id', $id)->update(['status' => 'refunded', 'updated_at' => now()]);
        $amount = $validated['amount_bdt'] ?? (int) $payment->amount_bdt;
        DB::table('wallet_transactions')->insert([
            'user_id' => $payment->user_id,
            'type' => 'debit',
            'source' => 'manual_refund',
            'amount_bdt' => $amount,
            'status' => 'settled',
            'meta' => json_encode(['payment_id' => $id, 'reason' => $validated['reason'] ?? null]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response()->json(['success' => true, 'message' => 'Refund issued', 'data' => null]);
    }

    public function withdrawals(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Withdrawals retrieved', 'data' => DB::table('withdrawal_requests')->orderByDesc('id')->paginate(20)]);
    }

    public function pendingWithdrawals(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Pending withdrawals retrieved', 'data' => DB::table('withdrawal_requests')->where('status', 'pending')->orderByDesc('id')->paginate(20)]);
    }

    public function approveWithdrawal(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('withdrawal_requests')->where('id', $id)->update(['status' => 'approved', 'processed_at' => now(), 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Withdrawal approved', 'data' => null]);
    }

    public function rejectWithdrawal(Request $request, int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $request->validate(['reason' => 'nullable|string|max:2000']);
        DB::table('withdrawal_requests')->where('id', $id)->update(['status' => 'rejected', 'processed_at' => now(), 'updated_at' => now()]);
        $this->addNote('withdrawal', $id, $request->reason ?? 'Rejected by admin');
        return response()->json(['success' => true, 'message' => 'Withdrawal rejected', 'data' => null]);
    }

    public function wallets(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }

        $rows = DB::table('users')
            ->where('user_type', 'trainer')
            ->select('id', 'name', 'email')
            ->get()
            ->map(function ($u) {
                $credit = (int) DB::table('wallet_transactions')->where('user_id', $u->id)->where('type', 'credit')->sum('amount_bdt');
                $debit = (int) DB::table('wallet_transactions')->where('user_id', $u->id)->where('type', 'debit')->sum('amount_bdt');
                return [
                    'trainer_id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'balance_bdt' => max($credit - $debit, 0),
                ];
            });

        return response()->json(['success' => true, 'message' => 'Wallet balances retrieved', 'data' => $rows]);
    }

    public function companyWallet(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $paid = (int) DB::table('payments')->where('status', 'paid')->sum('amount_bdt');
        $commission = (int) floor($paid * 0.15);
        return response()->json(['success' => true, 'message' => 'Company wallet retrieved', 'data' => ['company_commission_bdt' => $commission]]);
    }

    public function financeSummary(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $gmv = (int) DB::table('payments')->whereIn('status', ['paid', 'refunded'])->sum('amount_bdt');
        $paid = (int) DB::table('payments')->where('status', 'paid')->sum('amount_bdt');
        $refund = (int) DB::table('payments')->where('status', 'refunded')->sum('amount_bdt');
        $commission = (int) floor($paid * 0.15);
        return response()->json(['success' => true, 'message' => 'Finance summary retrieved', 'data' => [
            'gmv_bdt' => $gmv,
            'paid_bdt' => $paid,
            'refunded_bdt' => $refund,
            'commission_bdt' => $commission,
            'payout_bdt' => $paid - $commission,
        ]]);
    }

    // Review moderation
    public function reviews(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Reviews retrieved', 'data' => DB::table('reviews')->orderByDesc('id')->paginate(20)]);
    }

    public function flaggedReviews(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $ids = DB::table('review_reports')->select('review_id');
        return response()->json(['success' => true, 'message' => 'Flagged reviews retrieved', 'data' => DB::table('reviews')->where('is_flagged', 1)->orWhereIn('id', $ids)->orderByDesc('id')->paginate(20)]);
    }

    public function review(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $review = DB::table('reviews')->where('id', $id)->first();
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found', 'code' => 'NOT_FOUND'], 404);
        }
        return response()->json(['success' => true, 'message' => 'Review detail retrieved', 'data' => $review]);
    }

    public function deleteReview(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('reviews')->where('id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Review removed', 'data' => null]);
    }

    public function deleteReviewReply(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('reviews')->where('id', $id)->update(['trainer_reply' => null, 'trainer_replied_at' => null, 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Review reply removed', 'data' => null]);
    }

    public function clearReviewFlag(int $id): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('reviews')->where('id', $id)->update(['is_flagged' => 0, 'updated_at' => now()]);
        DB::table('review_reports')->where('review_id', $id)->delete();
        return response()->json(['success' => true, 'message' => 'Review flag cleared', 'data' => null]);
    }

    // Platform analytics
    public function analyticsOverview(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $users = DB::table('users')->count();
        $trainers = DB::table('users')->where('user_type', 'trainer')->count();
        $students = DB::table('users')->where('user_type', 'student')->count();
        $sessions = DB::table('bookings')->count();
        $revenue = (int) DB::table('payments')->where('status', 'paid')->sum('amount_bdt');
        return response()->json(['success' => true, 'message' => 'Analytics overview retrieved', 'data' => compact('users', 'trainers', 'students', 'sessions', 'revenue')]);
    }

    public function analyticsRevenue(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $rows = DB::table('payments')->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount_bdt) as total')->where('status', 'paid')->groupBy('month')->orderBy('month')->get();
        return response()->json(['success' => true, 'message' => 'Revenue analytics retrieved', 'data' => $rows]);
    }

    public function analyticsSessions(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $total = DB::table('bookings')->count();
        $completed = DB::table('bookings')->where('status', 'completed')->count();
        $cancelled = DB::table('bookings')->where('status', 'cancelled')->count();
        return response()->json(['success' => true, 'message' => 'Session analytics retrieved', 'data' => compact('total', 'completed', 'cancelled')]);
    }

    public function analyticsUsers(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $rows = DB::table('users')->selectRaw('DATE(created_at) as day, SUM(CASE WHEN user_type="trainer" THEN 1 ELSE 0 END) as trainers, SUM(CASE WHEN user_type="student" THEN 1 ELSE 0 END) as students')->groupBy('day')->orderBy('day')->get();
        return response()->json(['success' => true, 'message' => 'User analytics retrieved', 'data' => $rows]);
    }

    public function analyticsCategories(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $rows = DB::table('events')->leftJoin('bookings', 'bookings.event_id', '=', 'events.id')->leftJoin('payments', 'payments.booking_id', '=', 'bookings.id')->selectRaw('events.category, COUNT(bookings.id) as bookings, COALESCE(SUM(CASE WHEN payments.status="paid" THEN payments.amount_bdt ELSE 0 END),0) as revenue')->groupBy('events.category')->get();
        return response()->json(['success' => true, 'message' => 'Category analytics retrieved', 'data' => $rows]);
    }

    public function analyticsTopTrainers(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $rows = DB::table('users')->where('user_type', 'trainer')->select('id', 'name')->get()->map(function ($u) {
            $bookings = DB::table('bookings')->where('trainer_id', $u->id)->count();
            $avgRating = round((float) DB::table('reviews')->where('trainer_id', $u->id)->avg('rating'), 2);
            $earnings = (int) DB::table('wallet_transactions')->where('user_id', $u->id)->where('type', 'credit')->sum('amount_bdt');
            return ['trainer_id' => $u->id, 'name' => $u->name, 'bookings' => $bookings, 'avg_rating' => $avgRating, 'earnings_bdt' => $earnings];
        })->sortByDesc('earnings_bdt')->values()->take(20);

        return response()->json(['success' => true, 'message' => 'Top trainers analytics retrieved', 'data' => $rows]);
    }

    public function analyticsRetention(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $rows = DB::table('bookings')->whereNotNull('student_id')->selectRaw('student_id, COUNT(*) as booking_count')->groupBy('student_id')->get();
        $repeat = $rows->where('booking_count', '>', 1)->count();
        $total = $rows->count();
        $rate = $total > 0 ? round(($repeat / $total) * 100, 2) : 0;
        return response()->json(['success' => true, 'message' => 'Retention analytics retrieved', 'data' => ['repeat_students' => $repeat, 'total_students' => $total, 'repeat_rate' => $rate]]);
    }

    public function analyticsExport()
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }

        $lines = [
            'metric,value',
            'users,' . DB::table('users')->count(),
            'bookings,' . DB::table('bookings')->count(),
            'paid_revenue_bdt,' . (int) DB::table('payments')->where('status', 'paid')->sum('amount_bdt'),
        ];

        $csv = implode("\n", $lines);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="analytics_export.csv"',
        ]);
    }

    // Notifications & broadcast
    public function notifications(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Admin notifications retrieved', 'data' => DB::table('admin_notifications')->where('admin_id', Auth::id())->orderByDesc('id')->paginate(20)]);
    }

    public function notificationsReadAll(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        DB::table('admin_notifications')->where('admin_id', Auth::id())->update(['is_read' => 1, 'read_at' => now(), 'updated_at' => now()]);
        return response()->json(['success' => true, 'message' => 'Admin notifications marked as read', 'data' => null]);
    }

    public function broadcast(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate([
            'target_role' => 'nullable|in:all,student,trainer,admin',
            'title' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $targetRole = $validated['target_role'] ?? 'all';

        $id = DB::table('broadcast_messages')->insertGetId([
            'admin_id' => Auth::id(),
            'target_role' => $targetRole,
            'title' => $validated['title'],
            'message' => $validated['message'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $users = DB::table('users')->when($targetRole !== 'all', fn($q) => $q->where('user_type', $targetRole))->get(['id', 'user_type']);
        foreach ($users as $u) {
            if ($u->user_type === 'student' && DB::getSchemaBuilder()->hasTable('student_notifications')) {
                DB::table('student_notifications')->insert([
                    'user_id' => $u->id,
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'type' => 'broadcast',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            if ($u->user_type === 'trainer' && DB::getSchemaBuilder()->hasTable('trainer_notifications')) {
                DB::table('trainer_notifications')->insert([
                    'user_id' => $u->id,
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'type' => 'broadcast',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        DB::table('notification_logs')->insert([
            'admin_id' => Auth::id(),
            'channel' => 'in_app',
            'status' => 'sent',
            'message' => 'Broadcast #' . $id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Broadcast sent', 'data' => ['broadcast_id' => $id]], 201);
    }

    public function broadcastHistory(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Broadcast history retrieved', 'data' => DB::table('broadcast_messages')->orderByDesc('id')->paginate(20)]);
    }

    public function sendEmail(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        DB::table('notification_logs')->insert([
            'admin_id' => Auth::id(),
            'user_id' => $validated['user_id'],
            'channel' => 'email',
            'status' => 'sent',
            'message' => $validated['subject'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Email queued for delivery', 'data' => null], 201);
    }

    public function notificationLogs(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Notification logs retrieved', 'data' => DB::table('notification_logs')->orderByDesc('id')->paginate(50)]);
    }

    // Platform settings
    public function settings(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $settings = DB::table('platform_settings')->pluck('value', 'key')->map(fn($v) => json_decode($v, true));
        return response()->json(['success' => true, 'message' => 'Settings retrieved', 'data' => $settings]);
    }

    public function setCommission(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['trainer_percent' => 'required|numeric|min:1|max:99']);
        $this->updateSetting('commission', ['trainer_percent' => (float) $validated['trainer_percent'], 'platform_percent' => 100 - (float) $validated['trainer_percent']]);
        return response()->json(['success' => true, 'message' => 'Commission updated', 'data' => null]);
    }

    public function setMinPrice(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['min_price_bdt' => 'required|integer|min:1|max:100000']);
        $this->updateSetting('min_price', ['min_price_bdt' => $validated['min_price_bdt']]);
        return response()->json(['success' => true, 'message' => 'Minimum price updated', 'data' => null]);
    }

    public function setCategories(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['categories' => 'required|array|min:1', 'categories.*' => 'string|max:100']);
        $this->updateSetting('categories', $validated['categories']);
        return response()->json(['success' => true, 'message' => 'Categories updated', 'data' => null]);
    }

    public function setCancellationPolicy(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['policy' => 'required|string|max:5000']);
        $this->updateSetting('cancellation_policy', ['policy' => $validated['policy']]);
        return response()->json(['success' => true, 'message' => 'Cancellation policy updated', 'data' => null]);
    }

    public function setRecording(Request $request): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        $validated = $request->validate(['enabled' => 'required|boolean']);
        $this->updateSetting('recording', ['enabled' => $validated['enabled']]);
        return response()->json(['success' => true, 'message' => 'Recording setting updated', 'data' => null]);
    }

    public function settingsAuditLog(): JsonResponse
    {
        if ($r = $this->adminGuard()) {
            return $r;
        }
        return response()->json(['success' => true, 'message' => 'Settings audit log retrieved', 'data' => DB::table('settings_audit_logs')->orderByDesc('id')->paginate(50)]);
    }
}
