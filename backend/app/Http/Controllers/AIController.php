<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    private $flaskUrl = 'http://127.0.0.1:5000';

    public function predictPrice(Request $request)
    {
        $response = Http::post("{$this->flaskUrl}/predict-price", $request->all());
        return response()->json($response->json());
    }

    public function recommend(Request $request)
    {
        $response = Http::post("{$this->flaskUrl}/recommend", $request->all());
        return response()->json($response->json());
    }

    public function destination(Request $request)
    {
        $response = Http::post("{$this->flaskUrl}/destination", $request->all());
        return response()->json($response->json());
    }
}