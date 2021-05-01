<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function edit($id)
    {
        $user = User::find($id);
        return view('edit', ['user' => $user]);
    }

    public function update(Request $request, $id)
    {
        $inputs = $request->except('_token', '_method');

        $user = User::find($id);

        foreach ($inputs as $key => $value) {
            $user->$key = $value;
        }

        $user->save();

        return redirect(route('dashboard.index', 'update'));
    }

    public function destroy(Request $request)
    {

        $id = $request->id;
        $user = User::find($id);
        $user->delete();

        return redirect(route('dashboard.index', 'delete'));
    }
}
