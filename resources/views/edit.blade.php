@extends('layouts.dashboard')

@section('content')
<div class="d-flex h100 fx-center">
    <div class="card shadow-3 vself-center grey bg-blue2 txt-gl4 rounded-1">
        <div class=" card-header">Edit user</div>
        <div class="card-content">
            <form class="form-material" method="POST" action="{{ route('users.update', ['user' => $user->id]) }}">
                @method('PUT')
                @csrf
                <div class="grix xs2 gutter-xs4 txt-white">
                    <div class="form-field">
                        <input type="text" id="name" name="name" class="form-control" value="{{$user->name}}" />
                        <label for="name">Nom</label>
                    </div>
                    <div class="form-field">
                        <input type="number" id="actualMoney" name="actualMoney" class="form-control" value="{{$user->actualMoney}}" />
                        <label for="actualMoney">Actual Money</label>
                    </div>
                    <div class="form-field col-xs2">
                        <input type="text" id="email" name="email" class="form-control" value="{{$user->email}}" />
                        <label for="email">Email</label>
                    </div>
                </div>
                <div class="txt-center">
                    <button type="submit" class="btn orange dark-1 txt-white rounded-1 mt-3 mb-3">Mettre à jour</button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection