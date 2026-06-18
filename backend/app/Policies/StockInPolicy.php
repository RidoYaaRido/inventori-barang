<?php

namespace App\Policies;

use App\Models\StockIn;
use App\Models\User;

class StockInPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff'], true);
    }

    public function view(User $user, StockIn $stockIn): bool
    {
        return $user->role === 'admin' || $stockIn->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff'], true);
    }

    public function update(User $user, StockIn $stockIn): bool
    {
        return $this->view($user, $stockIn);
    }

    public function delete(User $user, StockIn $stockIn): bool
    {
        return $user->role === 'admin';
    }

    public function uploadProof(User $user, StockIn $stockIn): bool
    {
        return $this->view($user, $stockIn);
    }
}
