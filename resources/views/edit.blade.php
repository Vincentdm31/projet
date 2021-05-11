@extends('layouts.dashboard')

@section('content')
<div class="d-flex h100 fx-center">
    <div class="card shadow-3 vself-center grey bg-blue2 txt-gl4 rounded-1 mx-5">
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
    <div class="card shadow-3 vself-center grey bg-blue2 txt-gl4 rounded-1" style="width:400px;">
        <div class=" card-header">PUSH Notification</div>
        <div class="card-content">
            <div class="form-material">
                <div class="grix xs1 gutter-xs4 txt-white">
                    <input hidden type="text" id="userToken" value="{{ json_encode($user->rememberToken) }}">
                    <div class="form-field">
                        <input type="text" id="title-user" name="title-user" class="form-control" />
                        <label for="title-user">Title</label>
                    </div>
                    <div class="form-field">
                        <input type="text" id="body-user" name="body-user" class="form-control" />
                        <label for="body-user">Message</label>
                    </div>

                </div>
                <div class="txt-center">
                    <button onclick="sendToUser()" class="btn orange dark-1 txt-white rounded-1 mt-3 mb-3"><i class="fab fa-android"></i></button>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@section('extra-js')

<script>
    function sendToUser(e) {
        let user = JSON.parse(document.getElementById('userToken').value);
        let name = document.getElementById('title-user').value;
        let message = document.getElementById('body-user').value;

        var data = {
            to: user,
            notification: {
                title: name,
                body: message,
                sound: "default",
                priority: "high",
                show_in_foreground: true,
                targetScreen: "detail"
            },
            priority: 10
        }
        console.log(data);
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAAa2AhZtE:APA91bEnQdLuaC62oj6cqdfMP_BsWcEiJzz3gJG4Eh8AFfCqYDZolQito-y51mmB-qZDPRXrWeXgZRQrqbNacO1Cgroz_6HXEgB-R81dsS7Sv_YEHvmyN4YKVY5iMf4DTUxIMnAZkcHl"
            }
        }).then(function(response) {
            setTimeout(() => {
                //window.location.reload();
            }, 2500);
        }).catch(err => {
            console.log(err);
        })
    };
</script>
@endsection