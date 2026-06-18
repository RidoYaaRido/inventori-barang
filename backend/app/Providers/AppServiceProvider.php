<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\ItemPolicy;
use App\Policies\StockInPolicy;
use App\Policies\StockOutPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Item::class, ItemPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(StockIn::class, StockInPolicy::class);
        Gate::policy(StockOut::class, StockOutPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
