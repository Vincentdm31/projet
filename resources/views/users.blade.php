@extends('layouts.dashboard')
@section('content')
<div class="d-flex fx-col mx-5 pt-3">
    <div class="mb-5">
        <div class="userchart bg-blue2 shadow-3 rounded-1 p-3">
            {!! $userChart->container() !!}
            {!! $userChart->script() !!}
        </div>
    </div>
    <div class="grix md5 xs1 gutter-md7 gutter-xs4 vtop">
        <div class="responsive-table bg-blue2 shadow-3 rounded-1 vself-stretch px-3 pt-2 col-md3">
            <table class="table striped">
                <thead>
                    <tr class="txt-grey">
                        <th class="txt-grey txt-light-1 cursor-pointer" onclick="sortBy('Id')">#</th>
                        <th class="cursor-pointer" onclick="sortBy('Name')"><i class="fas fa-users mr-2"></i>Name</th>
                        <th class="cursor-pointer" onclick="sortBy('Email')"><i class="far fa-paper-plane mr-2"></i>Email</th>
                        <th class="cursor-pointer" onclick="sortBy('Money')"><i class="far fa-paper-plane mr-2"></i>Money</th>
                        <th><i class="fas fa-cogs mr-2"></i>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($users as $user)
                    <tr class="txt-gl4 table-row">
                        <td class="txt-grey">{{ $user->id }}</td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->actualMoney }}</td>
                        <td class="d-flex vcenter">
                            <a class="btn circle blue dark-1 txt-white small mr-2" href="{{ route('userStats', ['id' => $user->id]) }}"><i class="fas fa-chart-line"></i></a>
                            <a class="btn circle airforce dark-1 txt-white small mr-2" href="{{ route('users.edit', ['user' => $user->id]) }}"><i class="fas fa-pen"></i></a>
                            <button onclick='confirm(`{{$user->id}}`)' class="btn grey light-4 txt-red txt-dark-2 bd-solid bd-1 bd-blue circle small"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            <div class="d-flex fx-center mt-3">{{ $users->links('pagination') }}</div>
        </div>
        <div class="buildchart bg-blue2 shadow-3 rounded-1 col-md2 p-3">
            {!! $buildChart->container() !!}
            {!! $buildChart->script() !!}
        </div>
    </div>

</div>

<form class="d-flex mt-auto" id="sortByName" action=" {{route('sortBy', 'name')}}"></form>
<form class="d-flex mt-auto" id="sortByMoney" action=" {{route('sortBy', 'actualMoney')}}"></form>
<form class="d-flex mt-auto" id="sortByEmail" action=" {{route('sortBy', 'email')}}"></form>
<form class="d-flex mt-auto" id="sortById" action=" {{route('sortBy', 'id')}}"></form>

<div class="modal grey light-4 rounded-1" id="modal" data-ax="modal">
    <p>Confirmer la suppression ?</p>
    <form method="POST" action="{{route('users.destroy', ['user' => $user->id])}}">
        @method('DELETE')
        @csrf
        <input name="id" id="confirmlabel" hidden type="text">
        <button id="confirm" class="btn blue">Yes</button>
    </form>
    <button class="btn red">No</button>
</div>

@endsection

@section('extra-js')
<script>
    function sortBy(e) {
        return document.forms['sortBy' + e].submit();
    }

    function confirm(id) {
        console.log(id);
        Axentix.getInstance('#modal').open();
        document.getElementById('confirmlabel').value = id;
    }
</script>
@endsection