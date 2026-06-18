<?php

namespace App\Policies;

use App\Models\StockOut;
use App\Models\User;

class StockOutPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff'], true);
    }

    public function view(User $user, StockOut $stockOut): bool
    {
        return $user->role === 'admin' || $stockOut->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff'], true);
    }

    public function update(User $user, StockOut $stockOut): bool
    {
        return $this->view($user, $stockOut);
    }

    public function delete(User $user, StockOut $stockOut): bool
    {
        return $user->role === 'admin';
    }

    public function uploadProof(User $user, StockOut $stockOut): bool
    {
        return $this->view($user, $stockOut);
    }
}
