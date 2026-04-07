<?php

use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['prefix' => 'users'], function() {
    Route::get('', [\App\Http\Controllers\UserController::class, 'index']);
	Route::post('', [\App\Http\Controllers\UserController::class, 'store']);
});

Route::group(['prefix' => 'groups'], function() {
    Route::get('', [\App\Http\Controllers\GroupController::class, 'index']);
    Route::post('', [\App\Http\Controllers\GroupController::class, 'store']);
    Route::put('{group}', [\App\Http\Controllers\GroupController::class, 'update']);

    Route::post('{group:uuid}/users/{deviceId}', [\App\Http\Controllers\GroupController::class, 'join']);
});
