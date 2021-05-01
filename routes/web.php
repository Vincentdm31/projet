<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes(['register' => false]);

Route::middleware('auth')->group(function () {
    Route::middleware('admin')->group(function () {

        Route::get('/home', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/sortName', [DashboardController::class, 'sortName'])->name('sortName');
        Route::get('/sortMoney', [DashboardController::class, 'sortMoney'])->name('sortMoney');
        Route::get('/sortEmail', [DashboardController::class, 'sortEmail'])->name('sortEmail');
        Route::get('/sortBy/{column}', [DashboardController::class, 'sortBy'])->name('sortBy');

        Route::resource('dashboard', DashboardController::class);


        Route::get('/userstats/{id}', [DashboardController::class, 'getUserStats'])->name('userStats');
        Route::resource('users', UserController::class);

        Route::get('/pull', [DashboardController::class, 'pull'])->name('pull');
        Route::get('/mrs', [DashboardController::class, 'mrs'])->name('mrs');
        Route::get('/optimize', [DashboardController::class, 'optimize'])->name('optimize');
    });
});
