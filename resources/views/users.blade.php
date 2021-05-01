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
                    <tr class="txt-gl4 table-row" data-href="{{ route('userStats', ['id' => $user->id]) }}" onclick="window.event.target.nodeName == 'TD' ? document.location = this.dataset.href : ''">
                        <td class="txt-grey">{{ $user->id }}</td>
                        <td>{{ $user->name }}</td>
                        <td>{{ $user->email }}</td>
                        <td>{{ $user->actualMoney }}</td>
                        <td class="d-flex vcenter">
                            <a class="btn circle airforce dark-1 txt-white small mr-2" href="{{ route('users.edit', ['user' => $user->id]) }}"><i class="fas fa-pen"></i></a>
                            <button onclick=' confirm(`{{$user->id}}`)' class="btn grey light-4 txt-red txt-dark-2 bd-solid bd-1 bd-blue circle small"><i class="fas fa-trash"></i></button>
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

<form id="sortByName" action=" {{route('sortBy', 'name')}}"></form>
<form id="sortByMoney" action=" {{route('sortBy', 'actualMoney')}}"></form>
<form id="sortByEmail" action=" {{route('sortBy', 'email')}}"></form>
<form id="sortById" action=" {{route('sortBy', 'id')}}"></form>


<div class="modal bg-blue rounded-1 txt-center" id="modal" data-ax="modal">
    <p class="txt-gl4 font-s3">Confirmer la suppression ?</p>
    <div class="grix xs2 gutter-xs7 pb-4">

        <form method="POST" class="txt-right" action="{{route('users.destroy', ['user' => $user->id])}}">
            @method('DELETE')
            @csrf
            <input name="id" id="confirmlabel" hidden type="text">
            <button id="confirm" class="btn grey light-4 blue-txt rounded-1"><i class="fas fa-check"></i></button>
        </form>
        <button data-target="modal" class="btn modal-trigger red dark-3 rounded-1"><i class="fas fa-times"></i></button>

    </div>
</div>

@endsection

@section('extra-js')
<script>
    function sortBy(e) {
        return document.forms['sortBy' + e].submit();
    }

    function confirm(id) {
        Axentix.getInstance('#modal').open();
        document.getElementById('confirmlabel').value = id;
    }
</script>

<script>
    let toast = new Axentix.Toast();
</script>

@if(Request::exists('delete'))
<script>
    toast.change('Utilisateur supprimé', {
        classes: "rounded-1 red dark-4 txt-white mt-5"
    });
    toast.show();
</script>
@elseif(Request::exists('update'))
<script>
    toast.change('Utilisateur modifié', {
        classes: "rounded-1 blue dark-2 txt-white mt-5"
    });
    toast.show();
</script>
@endif
@endsection