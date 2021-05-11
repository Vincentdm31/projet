<!DOCTYPE html>
<html>

<head>
    <title>Axentix Layout - With sidenav</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/axentix@1.1.0/dist/css/axentix.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" />
    <link rel="stylesheet" href="{{ asset('/css/app.css') }}">
</head>

<body class="layout with-sidenav fixed-sidenav relative-pos overflow-hidden">
    <div id="sidenav" data-ax="sidenav" class="sidenav shadow-1 large fixed bg-blue2">
        <p class="txt-center font-s5 txt-gl4 my-5">DASHBOARD</p>
        <div class="divider white mb-5"></div>
        <a href="{{ route('dashboard.index') }}" class="sidenav-link txt-grey txt-light-1">DASHBOARD</a>

        <a href="#" class="collapsible-trigger sidenav-link txt-grey txt-light-1" data-target="collapsible">COMMANDS</a>
        <div>
            <div class="collapsible txt-gl4" id="collapsible" data-ax="collapsible">
                <a href="{{ route('pull') }}" class="sidenav-link">PULL</a>
                <a href="{{ route('mrs') }}" class="sidenav-link">MRS</a>
                <a href="{{ route('optimize') }}" class="sidenav-link">Optimize</a>
            </div>
        </div>
        <a class="sidenav-link txt-grey txt-light-1 modal-trigger" data-target="notif">PUSH NOTIFICATION</a>
    </div>
    <div class="modal bg-blue txt-gl4 p-4 d-block" id="notif" data-ax="modal" style="max-width:400px;">
        <form class="form-material">
            <div class="grix xs1">
                <div class="form-field">
                    <input type="text" id="title" name="title" class="form-control rounded-1" />
                    <label for="title">Title</label>
                </div>
                <div class="form-field">
                    <input type="text" id="body" name="body" class="form-control rounded-1" />
                    <label for="body">Body</label>
                </div>
                <input hidden id="tokenList" type="text" value="{{ json_encode($tokenList) }}" />
                <button type="button" class="btn grey light-4 rounded-1 txt-airforce txt-dark-4 font-w600 mx-auto mt-2 overflow-visible" onclick="send()">
                    SEND<i class="far fa-paper-plane pl-2"></i></button>
            </div>
        </form>
    </div>
    <main class="bg-blue">
        @yield('content')
    </main>
    <script src="https://cdn.jsdelivr.net/npm/axentix@1.1.0/dist/js/axentix.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js" charset="utf-8"></script>
    <script>
        function send() {

            let plane = document.createElement('i');

            plane.className = "fas fa-paper-plane plane pl-2 txt-grey txt-light-4 absolute-pos";

            plane.style.left = '-100%';
            plane.style.top = '0%';

            document.body.appendChild(plane);

            setTimeout(() => {
                plane.classList.add('active');

            }, 50);
            console.log(plane);

            let users = JSON.parse(document.getElementById('tokenList').value);
            let name = document.getElementById('title').value;
            let message = document.getElementById('body').value;

            var data = {
                registration_ids: users,
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

            fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "key=AAAAa2AhZtE:APA91bEnQdLuaC62oj6cqdfMP_BsWcEiJzz3gJG4Eh8AFfCqYDZolQito-y51mmB-qZDPRXrWeXgZRQrqbNacO1Cgroz_6HXEgB-R81dsS7Sv_YEHvmyN4YKVY5iMf4DTUxIMnAZkcHl"
                }
            }).then(function(response) {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }).catch(err => {
                console.log(err);
            })
        };
    </script>
    @yield('extra-js')
</body>

</html>