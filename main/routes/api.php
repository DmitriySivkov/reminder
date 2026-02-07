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
	Route::post('', [\App\Http\Controllers\UserController::class, 'store']);
});

Route::group(['prefix' => 'families'], function() {
    Route::get('', [\App\Http\Controllers\FamilyController::class, 'index']);
    Route::post('', [\App\Http\Controllers\FamilyController::class, 'store']);
    Route::put('{family}', [\App\Http\Controllers\FamilyController::class, 'update']);
});
