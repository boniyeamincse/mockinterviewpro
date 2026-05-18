<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerReviewController extends Controller
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
            'message' => 'Reviews retrieved',
            'data' => DB::table('reviews')->where('trainer_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function reply(Request $request, int $reviewId): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate(['reply' => 'required|string|max:2000']);

        $updated = DB::table('reviews')
            ->where('id', $reviewId)
            ->where('trainer_id', Auth::id())
            ->update([
                'trainer_reply' => $validated['reply'],
                'trainer_replied_at' => now(),
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return response()->json(['success' => false, 'message' => 'Review not found', 'code' => 'NOT_FOUND'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Review reply saved', 'data' => null]);
    }

    public function updateReply(Request $request, int $reviewId): JsonResponse
    {
        return $this->reply($request, $reviewId);
    }
}
