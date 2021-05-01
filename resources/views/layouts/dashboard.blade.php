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

<body class="layout with-sidenav fixed-sidenav">
    <div id="sidenav" data-ax="sidenav" class="sidenav shadow-1 large fixed bg-blue2">
        <p class="txt-center font-s5 txt-gl4 my-5">DASHBOARD</p>
        <div class="divider white mb-5"></div>
        <a href="{{ route('dashboard.index') }}" class="collapsible-trigger sidenav-link txt-grey txt-light-1" data-target="user-collapsible">Users</a>
        <a href="{{ route('pull') }}" class="collapsible-trigger sidenav-link txt-grey txt-light-1" data-target="user-collapsible">PULL</a>
        <a href="{{ route('mrs') }}" class="collapsible-trigger sidenav-link txt-grey txt-light-1" data-target="user-collapsible">MRS</a>
    </div>
    <main class="bg-blue">
        @yield('content')
    </main>

    <script src="https://cdn.jsdelivr.net/npm/axentix@1.1.0/dist/js/axentix.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js" charset="utf-8"></script>
    @yield('extra-js')
</body>

</html>