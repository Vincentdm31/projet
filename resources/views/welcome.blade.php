<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>

<body class="layout">
    <header>
        <div class="navbar-fixed">
            <nav class="navbar transparent">
                @if(Route::has('login'))
                <div class="navbar-menu ml-auto">
                    @auth
                    <a href="{{ url('/home') }}" class="navbar-link">{{ __('Home') }}</a>
                    @else
                    <a href="{{ route('login') }}" class="navbar-link txt-gl4">{{ __('Login') }}</a>
                    @if (Route::has('register'))
                    <a href="{{ route('register') }}" class="navbar-link">{{ __('Register') }}</a>
                    @endif
                    @endauth
                </div>
                @endif
            </nav>
        </div>
    </header>

    <main class="home-bg" style="margin-top:-3.5rem; height:100Vh;">
        <div class="d-flex fx-col h100 fx-center vcenter">
            <h1 class="txt-gl4">PROJET B3 2021</h1>
            <img src="{{ asset('/img/clicker-home.png') }}" class="responsive-media" alt="" srcset="">
        </div>
    </main>
    <script src="{{ mix('js/app.js') }}"></script>

</body>

</html>