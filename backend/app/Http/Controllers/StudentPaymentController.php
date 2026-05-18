<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StudentPaymentController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isStudent() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Student access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }

        return null;
    }

    public function initiate(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'booking_id' => 'required|integer|exists:bookings,id',
            'amount_bdt' => 'required|integer|min:1',
        ]);

        $booking = DB::table('bookings')->where('id', $validated['booking_id'])->where('student_id', Auth::id())->first();
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found', 'code' => 'NOT_FOUND'], 404);
        }

        $ref = 'PAY-' . strtoupper(Str::random(10));

        $id = DB::table('payments')->insertGetId([
            'user_id' => Auth::id(),
            'booking_id' => $booking->id,
            'reference' => $ref,
            'amount_bdt' => $validated['amount_bdt'],
            'status' => 'initiated',
            'gateway' => 'mock',
            'meta' => json_encode(['gateway_url' => url('/pay/mock/' . $ref)]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment initiated',
            'data' => [
                'payment_id' => $id,
                'reference' => $ref,
                'gateway_url' => url('/pay/mock/' . $ref),
            ],
        ], 201);
    }

    public function verify(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'payment_id' => 'required|integer|exists:payments,id',
            'success' => 'required|boolean',
        ]);

        $payment = DB::table('payments')->where('id', $validated['payment_id'])->where('user_id', Auth::id())->first();
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found', 'code' => 'NOT_FOUND'], 404);
        }

        DB::table('payments')->where('id', $payment->id)->update([
            'status' => $validated['success'] ? 'paid' : 'failed',
            'paid_at' => $validated['success'] ? now() : null,
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment verification completed',
            'data' => DB::table('payments')->where('id', $payment->id)->first(),
        ]);
    }

    public function index(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Payments retrieved',
            'data' => DB::table('payments')->where('user_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $payment = DB::table('payments')->where('id', $id)->where('user_id', Auth::id())->first();
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Payment detail retrieved', 'data' => $payment]);
    }

    public function receipt(int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $payment = DB::table('payments')->where('id', $id)->where('user_id', Auth::id())->first();
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Receipt generated',
            'data' => [
                'payment_id' => $payment->id,
                'reference' => $payment->reference,
                'amount_bdt' => $payment->amount_bdt,
                'status' => $payment->status,
                'receipt_url' => url('/api/student/payments/' . $payment->id . '/receipt'),
            ],
        ]);
    }
}
