<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerNotificationController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isTrainer() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Trainer access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }
        return null;
    }

    public function index(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifications retrieved',
            'data' => DB::table('trainer_notifications')->where('user_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function read(int $id): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $updated = DB::table('trainer_notifications')->where('id', $id)->where('user_id', Auth::id())->update([
            'is_read' => true,
            'read_at' => now(),
            'updated_at' => now(),
        ]);

        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Notification not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Notification marked as read', 'data' => null]);
    }

    public function readAll(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        DB::table('trainer_notifications')->where('user_id', Auth::id())->update([
            'is_read' => true,
            'read_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'All notifications marked as read', 'data' => null]);
    }

    public function updatePreferences(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'email_enabled' => 'required|boolean',
            'sms_enabled' => 'required|boolean',
            'push_enabled' => 'required|boolean',
        ]);

        DB::table('trainer_notification_preferences')->updateOrInsert(
            ['user_id' => Auth::id()],
            [...$validated, 'created_at' => now(), 'updated_at' => now()]
        );

        return response()->json(['success' => true, 'message' => 'Notification preferences updated', 'data' => null]);
    }
}
