<?php

namespace App\Http\Controllers;

use App\Charts\BuildChart;
use App\Charts\UserChart;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Redirect;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $users = $this->getTotalUsers();
        $userChart = $this->getUserChart();
        $buildChart = $this->getBuildChart();

        return view('users', [
            'users' => $users[0],
            'userCount' => $users[1],
            'userChart' => $userChart,
            'buildChart' => $buildChart,
            'request' => $request,
            'tokenList' => $this->getTokenList()
        ]);
    }

    public function sortBy($column)
    {
        $users = User::orderBy($column)->get();

        $userCount = $this->getTotalUsers();

        if ($column == 'actualMoney') {
            $users = User::orderBy($column, 'desc')->paginate(5);
        } else {
            $users = User::orderBy($column)->paginate(5);
        }

        $userChart = $this->getUserChart();
        $buildChart = $this->getBuildChart();

        return view('users', [
            'users' => $users,
            'userCount' => $userCount[1],
            'userChart' => $userChart,
            'buildChart' => $buildChart,
            'tokenList' => $this->getTokenList()
        ]);
    }

    private function getUserChart()
    {
        $abs = [];
        $usersCount = [];
        $dailyUsers = [];

        for ($i = 14; $i >= 0; $i--) {

            // Si on est ajd
            if ($i == 0) {
                //Liste des absices
                array_push($abs, Carbon::today()->format('d-m-Y'));

                // Nombre d'users créé ajd
                array_push($dailyUsers, User::where('created_at', Carbon::today())->count());

                //Nbr total d'user d'ajd
                array_push($usersCount, User::where('created_at', '<=', Carbon::today())->count());
                // Les jours d'avant
            } else {
                array_push($abs, Carbon::today()->subDay($i)->format('d-m-Y'));
                array_push($dailyUsers, User::where('created_at', Carbon::today()->subDay($i))->count());
                array_push($usersCount, User::where('created_at', '<=', Carbon::today()->subDay($i))->count());
            }
        }
        dd($abs, $usersCount, $dailyUsers);

        $userChart = new UserChart;
        $userChart->labels($abs);
        $userChart->title('Registered users');
        $userChart->options([
            'tooltip' => ['show' => true],
            'scales' => [
                'yAxes' => [
                    [
                        'ticks' => ['beginAtZero' => true, 'fontColor' => '#A7BAEB'],
                        'position' => 'right',
                        'id' => 'y-axis-1',

                    ],
                    [
                        'ticks' => ['beginAtZero' => true, 'fontColor' => '#fff'],
                        'position' => 'left',
                        'id' => 'y-axis-2'
                    ],
                ]
            ]
        ]);

        $userChart->dataset('Total', 'line', $usersCount)->color('#fff')->options([
            'borderColor' => '#A7BAEB',
            'yAxisID' => 'y-axis-1',


        ]);
        $userChart->dataset('Daily', 'line', $dailyUsers)->color('#fff')->options([
            'borderColor' => '#fff',
            'yAxisID' => 'y-axis-2'
        ]);

        return $userChart;
    }

    private function getBuildChart()
    {
        $buildChart = new BuildChart;
        $buildChart->labels(['Tepee', 'Hut', 'House', 'Villa', 'Temple']);
        $buildChart->title('Total Buildings');
        $buildChart->dataset('Total', 'doughnut', [30, 54, 86, 43, 22])->backgroundColor([
            '#6289EE',
            '#4C556B',
            '#A7BAEB',
            '#2C3E6B',
            '#8594BB',
        ])->color('#fff');

        return $buildChart;
    }

    private function getTotalUsers()
    {
        $users = User::orderBy('id')->get();
        $userCount = count($users);

        $users = User::orderBy('id')->paginate(5);

        return [$users, $userCount];
    }

    public function getUserStats($id)
    {
        $users = $this->getTotalUsers();
        $userChart = $this->getUserChart();

        $user = User::find($id);

        $userBuildings = json_decode($user->buildings);

        $arrBuildingName = [];
        $arrBuildCount = [];

        foreach ($userBuildings as $key => $value) {
            array_push($arrBuildingName, $key);
            array_push($arrBuildCount, $value);
        }

        $buildChart = new BuildChart;
        $buildChart->labels($arrBuildingName);
        $buildChart->title($user->name . ' Buildings');
        $buildChart->dataset('Total', 'doughnut', $arrBuildCount)->backgroundColor([
            '#6289EE',
            '#4C556B',
            '#A7BAEB',
            '#2C3E6B',
            '#8594BB',
        ])->color('#fff');



        return view('users', [
            'users' => $users[0],
            'userCount' => $users[1],
            'userChart' => $userChart,
            'buildChart' => $buildChart,
            'tokenList' => $this->getTokenList()
        ]);
    }

    public function pull()
    {
        exec('git pull');

        return redirect(route('dashboard.index'));
    }

    public function optimize()
    {
        Artisan::call('optimize');

        return Redirect::to('https://projet.vincent-dimarco.fr/home');
    }

    static function getTokenList()
    {
        $userList = User::all();
        $tokenList = [];

        foreach ($userList as $user) {
            if ($user->rememberToken != null) {
                array_push($tokenList, $user->rememberToken);
            }
        }

        return $tokenList;
    }
}
