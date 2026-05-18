<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TrainerWalletController extends Controller
{
    private function guard(): ?JsonResponse
    {
        $u = Auth::user();
        if (!$u || (!$u->isTrainer() && !$u->isAdmin())) {
            return response()->json(['success' => false, 'message' => 'Trainer access required', 'code' => 'INSUFFICIENT_PERMISSIONS'], 403);
        }
        return null;
    }

    public function wallet(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $credit = (int) DB::table('wallet_transactions')->where('user_id', Auth::id())->where('type', 'credit')->sum('amount_bdt');
        $debit = (int) DB::table('wallet_transactions')->where('user_id', Auth::id())->where('type', 'debit')->sum('amount_bdt');
        $pending = (int) DB::table('withdrawal_requests')->where('user_id', Auth::id())->where('status', 'pending')->sum('amount_bdt');

        return response()->json([
            'success' => true,
            'message' => 'Wallet retrieved',
            'data' => [
                'available_balance_bdt' => max($credit - $debit - $pending, 0),
                'pending_withdrawal_bdt' => $pending,
                'total_credited_bdt' => $credit,
                'total_debited_bdt' => $debit,
            ],
        ]);
    }

    public function transactions(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Transactions retrieved',
            'data' => DB::table('wallet_transactions')->where('user_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function withdraw(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate(['amount_bdt' => 'required|integer|min:100']);

        $account = DB::table('trainer_bank_accounts')->where('user_id', Auth::id())->first();
        if (!$account) {
            return response()->json(['success' => false, 'message' => 'Bank account required', 'code' => 'BANK_ACCOUNT_REQUIRED'], 422);
        }

        DB::table('withdrawal_requests')->insert([
            'user_id' => Auth::id(),
            'amount_bdt' => $validated['amount_bdt'],
            'status' => 'pending',
            'account_snapshot' => json_encode($account),
            'requested_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Withdrawal requested', 'data' => null], 201);
    }

    public function withdrawals(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Withdrawals retrieved',
            'data' => DB::table('withdrawal_requests')->where('user_id', Auth::id())->orderByDesc('id')->paginate(20),
        ]);
    }

    public function saveBankAccount(Request $request): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        $validated = $request->validate([
            'account_type' => 'required|in:bank,bkash,nagad',
            'account_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'routing_number' => 'nullable|string|max:255',
            'mobile_wallet' => 'nullable|string|max:255',
        ]);

        DB::table('trainer_bank_accounts')->updateOrInsert(
            ['user_id' => Auth::id()],
            [
                ...$validated,
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        return response()->json(['success' => true, 'message' => 'Bank account saved', 'data' => null]);
    }

    public function getBankAccount(): JsonResponse
    {
        if ($r = $this->guard()) {
            return $r;
        }

        return response()->json([
            'success' => true,
            'message' => 'Bank account retrieved',
            'data' => DB::table('trainer_bank_accounts')->where('user_id', Auth::id())->first(),
        ]);
    }
}
