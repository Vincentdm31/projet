@if ($paginator->hasPages())
<div>
    <ul class="pagination">
        {{-- Previous Page Link --}}
        @if ($paginator->onFirstPage())
        <li class="disabled">
            <a href=""><i class="fas fa-step-backward"></i></a>
        </li>

        <li class="disabled">
            <a href=""><i class="fas fa-angle-left"></i></a>
        </li>
        @else
        <li>
            <a href="?page=1" class="dark txt-white rounded-2"><i class="fas fa-step-backward"></i></a>
        </li>

        <li>
            <a href="{{ $paginator->previousPageUrl() }}" class="dark txt-white rounded-2"><i class="fas fa-angle-left"></i></a>
        </li>
        @endif

        {{-- Pagination Elements --}}
        @foreach ($elements as $element)
        {{-- "Three Dots" Separator --}}
        @if (is_string($element))
        <li class="disabled txt-white"><a href="">{{ $element }}</a></li>
        @endif

        {{-- Array Of Links --}}
        @if (is_array($element))
        @foreach ($element as $page => $url)
        @if ($page == $paginator->currentPage())
        <li class="active"><a href="">{{ $page }}</a></li>
        @else
        <li><a href="{{ $url }}" class="dark txt-white rounded-2">{{ $page }}</a></li>
        @endif
        @endforeach
        @endif
        @endforeach

        {{-- Next Page Link --}}
        @if ($paginator->hasMorePages())
        <li>
            <a href="{{ $paginator->nextPageUrl() }}" class="dark txt-white rounded-2"><i class="fas fa-angle-right"></i></a>
        </li>

        <li>
            <a href="?page={{ $paginator->lastPage() }}" class="dark txt-white rounded-2"><i class="fas fa-step-forward"></i></a>
        </li>
        @else
        <li class="disabled">
            <a href=""><i class="fas fa-angle-right"></i></a>
        </li>

        <li class="disabled">
            <a href=""><i class="fas fa-step-forward"></i></a>
        </li>
        @endif
    </ul>
</div>
@endif