/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axentix/dist/js/axentix.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/axentix/dist/js/axentix.esm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Axentix": () => (/* binding */ Axentix)
/* harmony export */ });
"use strict";

/**
 * Class AxentixComponent
 * @class
 */
class AxentixComponent {
  preventDbInstance(element) {
    if (element && Axentix.getInstance(element)) {
      throw new Error("Instance already exist on ".concat(element));
    }
  }
  /**
   * Sync all listeners
   */


  sync() {
    Axentix.createEvent(this.el, 'component.sync');

    this._removeListeners();

    this._setupListeners();
  }
  /**
   * Reset component
   */


  reset() {
    Axentix.createEvent(this.el, 'component.reset');

    this._removeListeners();

    this._setup();
  }
  /**
   * Destroy component
   */


  destroy() {
    Axentix.createEvent(this.el, 'component.destroy');

    this._removeListeners();

    var index = Axentix.instances.findIndex(ins => ins.instance.el.id === this.el.id);
    Axentix.instances.splice(index, 1);
  }

}
/**
 * Class Axentix
 * @class
 */


class Axentix {
  /**
   * Construct Axentix instance
   * @constructor
   * @param {String} component
   * @param {Object} options
   */
  constructor(component, options) {
    this.component = component[0].toUpperCase() + component.slice(1).toLowerCase();
    this.isAll = component === 'all' ? true : false;
    this.options = this.isAll ? {} : options;

    this._init();
  }
  /**
   * Init components
   */


  _init() {
    var componentList = Axentix.Config.getAutoInitElements();
    var isInList = componentList.hasOwnProperty(this.component);

    if (isInList) {
      var ids = this._detectIds(componentList[this.component]);

      this._instanciate(ids, this.component);
    } else if (this.isAll) {
      Object.keys(componentList).map(component => {
        var ids = this._detectIds(componentList[component]);

        ids.length > 0 ? this._instanciate(ids, component) : '';
      });
    }
  }
  /**
   * Detects all ids
   * @param {NodeListOf<Element>} component
   * @return {Array<String>}
   */


  _detectIds(component) {
    var idList = [];
    component.forEach(el => {
      idList.push('#' + el.id);
    });
    return idList;
  }
  /**
   * Instanciate components
   * @param {Array<String>} ids
   * @param {String} component
   */


  _instanciate(ids, component) {
    ids.map(id => {
      var constructor = Axentix[component];
      var args = [id, this.options];

      try {
        new constructor(...args);
      } catch (error) {
        console.error('[Axentix] Unable to load ' + component, error);
      }
    });
  }

}

Axentix.instances = []; // require: ax-core.js

Axentix.Config = (() => {
  var config = {
    components: [],
    plugins: []
  };

  var get = () => {
    return config;
  };

  var getDataElements = () => {
    var dataComponents = config.components.filter(component => component.dataDetection);
    var dataPlugins = config.plugins.filter(plugin => plugin.dataDetection);
    return [...dataComponents, ...dataPlugins].reduce((acc, el) => {
      acc.push(el.name);
      return acc;
    }, []);
  };

  var getAutoInitElements = () => {
    var autoInitComponents = config.components.filter(component => component.autoInit && component.autoInit.enabled);
    var autoInitPlugins = config.plugins.filter(plugin => plugin.autoInit && plugin.autoInit.enabled);
    return [...autoInitComponents, ...autoInitPlugins].reduce((acc, el) => {
      acc[el.name] = document.querySelectorAll(el.autoInit.selector);
      return acc;
    }, {});
  };
  /**
   * Register an element
   * @param {{ name: string, dataDetection?: boolean, autoInit?: {enabled: boolean, selector: string}, class: any }} el
   * @param {String} term
   */


  var register = (el, term) => {
    if (!el.name || !el.class) {
      console.error("[Axentix] Error registering ".concat(term, " : Missing required parameters."));
      return;
    }

    if (config[term].some(elem => elem.name === el.name)) {
      console.error("[Axentix] Error registering ".concat(term, " : Already exist."));
      return;
    }

    config[term].push(el);
    Axentix[el.name] = el.class;
  };

  var registerComponent = component => {
    register(component, 'components');
  };

  var registerPlugin = plugin => {
    register(plugin, 'plugins');
  };

  return {
    get,
    getDataElements,
    getAutoInitElements,
    registerComponent,
    registerPlugin
  };
})();

Axentix.DataDetection = (() => {
  var getFormattedName = name => {
    return name.replace(/[\w]([A-Z])/g, s => {
      return s[0] + '-' + s[1];
    }).toLowerCase();
  };

  var getName = (name, baseName = '') => {
    var fmtName = getFormattedName(name);
    return baseName ? baseName + '-' + fmtName : fmtName;
  };

  var getOptions = (obj, component, element, baseName = '') => {
    return Object.keys(obj).reduce((acc, name, i) => {
      if (typeof obj[name] === 'object' && obj[name] !== null) {
        var tmpOptName = name[0].toUpperCase() + name.slice(1).toLowerCase();
        Axentix.Config.getDataElements().includes(tmpOptName) && component !== 'Collapsible' && tmpOptName !== 'Sidenav' ? obj[name] = Axentix[tmpOptName].getDefaultOptions() : '';
        var fmtName = baseName ? baseName + '-' + name : name;
        var keys = getOptions(obj[name], component, element, fmtName);
        Object.keys(keys).length === 0 && obj.constructor === Object ? '' : acc[name] = keys;
      } else if (obj[name] !== null) {
        var dataAttribute = 'data-' + component.toLowerCase() + '-' + getName(name, baseName);

        if (element.hasAttribute(dataAttribute)) {
          var attr = element.getAttribute(dataAttribute);
          acc[name] = typeof obj[name] === 'boolean' ? attr === 'true' : typeof obj[name] === 'number' ? Number(attr) : attr;
        }
      }

      return acc;
    }, {});
  };
  /**
   * Format options provided
   * @param {string} component
   * @param {Element} element
   * @return {object}
   */


  var formatOptions = (component, element) => {
    var defaultOptions = Axentix[component].getDefaultOptions();
    return getOptions(defaultOptions, component, element);
  };

  var setup = () => {
    var elements = document.querySelectorAll('[data-ax]');
    elements.forEach(el => {
      var component = el.dataset.ax;
      component = component[0].toUpperCase() + component.slice(1).toLowerCase();

      if (!Axentix.Config.getDataElements().includes(component)) {
        console.error("[Axentix] Error: This component doesn't exist.", el);
        return;
      }

      try {
        var options = formatOptions(component, el);
        new Axentix[component]("#".concat(el.id), options, true);
      } catch (error) {
        console.error('[Axentix] Data: Unable to load ' + component, error);
      }
    });
  };

  var setupAll = () => {
    new Axentix('all');
  };

  return {
    setup,
    setupAll,
    formatOptions
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.axentix ? Axentix.DataDetection.setupAll() : '';
  Axentix.DataDetection.setup();
});

(() => {
  /**
   * Class Caroulix
   * @class
   */
  class Caroulix extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 500,
        height: '',
        backToOpposite: true,
        enableTouch: true,
        indicators: {
          enabled: false,
          isFlat: false,
          customClasses: ''
        },
        autoplay: {
          enabled: true,
          interval: 5000,
          side: 'right'
        }
      };
    }
    /**
     * Construct Caroulix instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Caroulix',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Caroulix', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Caroulix init error', error);
      }
    }

    _setup() {
      Axentix.createEvent(this.el, 'caroulix.setup');
      this.options.autoplay.side = this.options.autoplay.side.toLowerCase();
      var sideList = ['right', 'left'];
      sideList.includes(this.options.autoplay.side) ? '' : this.options.autoplay.side = 'right';
      this.activeIndex = 0;
      this.draggedPositionX = 0;
      this.isAnimated = false;

      this._getChildren();

      this.options.indicators.enabled ? this._enableIndicators() : '';
      var activeEl = this.el.querySelector('.active');

      if (activeEl) {
        this.activeIndex = this.children.indexOf(activeEl);
      } else {
        this.children[0].classList.add('active');
      }

      this._waitForLoad();

      this.totalMediaToLoad === 0 ? this._setBasicCaroulixHeight() : '';

      this._setupListeners();

      this.options.autoplay.enabled ? this.play() : '';
    }

    _setupListeners() {
      this.windowResizeRef = this._setBasicCaroulixHeight.bind(this);
      window.addEventListener('resize', this.windowResizeRef);

      if (this.arrowNext) {
        this.arrowNextRef = this.next.bind(this, 1);
        this.arrowNext.addEventListener('click', this.arrowNextRef);
      }

      if (this.arrowPrev) {
        this.arrowPrevRef = this.prev.bind(this, 1);
        this.arrowPrev.addEventListener('click', this.arrowPrevRef);
      }

      if (this.options.enableTouch) {
        this.touchStartRef = this._handleDragStart.bind(this);
        this.touchMoveRef = this._handleDragMove.bind(this);
        this.touchReleaseRef = this._handleDragRelease.bind(this);
        var isTouch = Axentix.isTouchEnabled(),
            isPointer = Axentix.isPointerEnabled();
        this.el.addEventListener(isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousestart', this.touchStartRef);
        this.el.addEventListener(isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove', this.touchMoveRef);
        this.el.addEventListener(isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup', this.touchReleaseRef);
        this.el.addEventListener(isPointer ? 'pointerleave' : 'mouseleave', this.touchReleaseRef);
      }
    }

    _removeListeners() {
      window.removeEventListener('resize', this.windowResizeRef);
      this.windowResizeRef = undefined;

      if (this.arrowNext) {
        this.arrowNext.removeEventListener('click', this.arrowNextRef);
        this.arrowNextRef = undefined;
      }

      if (this.arrowPrev) {
        this.arrowPrev.removeEventListener('click', this.arrowPrevRef);
        this.arrowPrevRef = undefined;
      }

      if (this.options.enableTouch) {
        var isTouch = Axentix.isTouchEnabled(),
            isPointer = Axentix.isPointerEnabled();
        this.el.removeEventListener(isTouch ? 'touchstart' : isPointer ? 'pointerdown' : 'mousestart', this.touchStartRef);
        this.el.removeEventListener(isTouch ? 'touchmove' : isPointer ? 'pointermove' : 'mousemove', this.touchMoveRef);
        this.el.removeEventListener(isTouch ? 'touchend' : isPointer ? 'pointerup' : 'mouseup', this.touchReleaseRef);
        this.el.removeEventListener(isPointer ? 'pointerleave' : 'mouseleave', this.touchReleaseRef);
        this.touchStartRef = undefined;
        this.touchMoveRef = undefined;
        this.touchReleaseRef = undefined;
      }
    }

    _getChildren() {
      this.children = Array.from(this.el.children).reduce((acc, child) => {
        child.classList.contains('caroulix-item') ? acc.push(child) : '';
        child.classList.contains('caroulix-prev') ? this.arrowPrev = child : '';
        child.classList.contains('caroulix-next') ? this.arrowNext = child : '';
        return acc;
      }, []);
    }

    _waitForLoad() {
      this.totalMediaToLoad = 0;
      this.loadedMediaCount = 0;
      this.children.map(item => {
        var media = item.querySelector('img, video');

        if (media) {
          this.totalMediaToLoad++;

          if (media.complete) {
            this._newItemLoaded(media, true);
          } else {
            media.loadRef = this._newItemLoaded.bind(this, media);
            media.addEventListener('load', media.loadRef);
          }
        }
      });
    }

    _newItemLoaded(media, alreadyLoad) {
      this.loadedMediaCount++;

      if (!alreadyLoad) {
        media.removeEventListener('load', media.loadRef);
        media.loadRef = undefined;
      }

      if (this.totalMediaToLoad == this.loadedMediaCount) {
        this._setBasicCaroulixHeight();

        this._setItemsPosition(true);
      }
    }

    _setItemsPosition(init = false) {
      var caroulixWidth = this.el.getBoundingClientRect().width;
      this.children.map((child, index) => {
        child.style.transform = "translateX(".concat(caroulixWidth * index - caroulixWidth * this.activeIndex - this.draggedPositionX, "px)");
      });
      this.options.indicators.enabled ? this._resetIndicators() : '';
      var activeElement = this.children.find(child => child.classList.contains('active'));
      activeElement.classList.remove('active');
      this.children[this.activeIndex].classList.add('active');
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
      init ? setTimeout(() => this._setTransitionDuration(this.options.animationDuration), 50) : '';
    }

    _setBasicCaroulixHeight() {
      this.isResizing = true;
      this.el.style.transitionDuration = '';
      this.options.autoplay.enabled ? this.play() : '';

      if (this.options.height) {
        this.el.style.height = this.options.height;
      } else {
        var childrenHeight = this.children.map(child => {
          return child.offsetHeight;
        });
        var maxHeight = Math.max(...childrenHeight);
        this.el.style.height = maxHeight + 'px';
      }

      this._setItemsPosition();

      setTimeout(() => {
        this.el.style.transitionDuration = this.options.animationDuration + 'ms';
        this.isResizing = false;
      }, 50);
    }

    _handleDragStart(e) {
      if (e.target.closest('.caroulix-arrow') || e.target.closest('.caroulix-indicators')) return;
      e.type !== 'touchstart' ? e.preventDefault() : '';
      if (this.isAnimated) return;
      this.options.autoplay.enabled ? this.stop() : '';

      this._setTransitionDuration(0);

      this.isPressed = true;
      this.isScrolling = false;
      this.isVerticallyDragged = false;
      this.deltaX = 0;
      this.deltaY = 0;
      this.xStart = this._getXPosition(e);
      this.yStart = this._getYPosition(e);
    }

    _handleDragMove(e) {
      if (!this.isPressed || this.isScrolling) return;

      var x = this._getXPosition(e),
          y = this._getYPosition(e);

      this.deltaX = this.xStart - x;
      this.deltaY = Math.abs(this.yStart - y);

      if (e.type === 'touchmove' && this.deltaY > Math.abs(this.deltaX)) {
        this.isScrolling = true;
        this.deltaX = 0;
        return false;
      }

      e.cancelable ? e.preventDefault() : '';
      this.draggedPositionX = this.deltaX;

      this._setItemsPosition();
    }

    _handleDragRelease(e) {
      if (e.target.closest('.caroulix-arrow') || e.target.closest('.caroulix-indicators')) return false;
      e.cancelable ? e.preventDefault() : '';

      if (this.isPressed) {
        this._setTransitionDuration(this.options.animationDuration);

        var caroulixWidth = this.el.getBoundingClientRect().width;
        this.isPressed = false;

        if (this.options.backToOpposite && this.activeIndex !== this.children.length - 1 && this.deltaX > caroulixWidth * 15 / 100 || !this.options.backToOpposite && this.deltaX > caroulixWidth * 15 / 100) {
          this.next();
        } else if (this.options.backToOpposite && this.activeIndex !== 0 && this.deltaX < -caroulixWidth * 15 / 100 || !this.options.backToOpposite && this.deltaX < -caroulixWidth * 15 / 100) {
          this.prev();
        }

        this.deltaX = 0;
        this.draggedPositionX = 0;

        this._setItemsPosition();

        this.options.autoplay.enabled ? this.play() : '';
      }
    }

    _enableIndicators() {
      this.indicators = document.createElement('ul');
      this.indicators.classList.add('caroulix-indicators');
      this.options.indicators.isFlat ? this.indicators.classList.add('caroulix-flat') : '';
      this.options.indicators.customClasses ? this.indicators.className = this.indicators.className + ' ' + this.options.indicators.customClasses : '';

      for (var i = 0; i < this.children.length; i++) {
        var li = document.createElement('li');
        li.triggerRef = this._handleIndicatorClick.bind(this, i);
        li.addEventListener('click', li.triggerRef);
        this.indicators.appendChild(li);
      }

      this.el.appendChild(this.indicators);
    }

    _handleIndicatorClick(i, e) {
      e.preventDefault();
      if (i === this.activeIndex) return;
      this.goTo(i);
    }

    _resetIndicators() {
      Array.from(this.indicators.children).map(li => {
        li.removeAttribute('class');
      });
      this.indicators.children[this.activeIndex].classList.add('active');
    }

    _getXPosition(e) {
      if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientX;
      }

      return e.clientX;
    }

    _getYPosition(e) {
      if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientY;
      }

      return e.clientY;
    }

    _setTransitionDuration(duration) {
      this.el.style.transitionDuration = duration + 'ms';
    }

    _emitSlideEvent() {
      Axentix.createEvent(this.el, 'caroulix.slide', {
        nextElement: this.children[this.activeIndex],
        currentElement: this.children[this.children.findIndex(child => child.classList.contains('active'))]
      });
    }

    goTo(number) {
      if (number === this.activeIndex) return;
      var side;
      number > this.activeIndex ? side = 'right' : side = 'left';
      side === 'left' ? this.prev(Math.abs(this.activeIndex - number)) : this.next(Math.abs(this.activeIndex - number));
      this.options.indicators.enabled ? this._resetIndicators() : '';
    }

    play() {
      if (!this.options.autoplay.enabled) return;
      this.stop();
      this.autoplayInterval = setInterval(() => {
        this.options.autoplay.side === 'right' ? this.next(1, false) : this.prev(1, false);
      }, this.options.autoplay.interval);
    }

    stop() {
      if (!this.options.autoplay.enabled) return;
      clearInterval(this.autoplayInterval);
    }

    next(step = 1, resetAutoplay = true) {
      if (this.isResizing || this.activeIndex === this.children.length - 1 && !this.options.backToOpposite) return;
      Axentix.createEvent(this.el, 'caroulix.next', {
        step
      });
      this.isAnimated = true;
      resetAutoplay && this.options.autoplay.enabled ? this.stop() : '';

      if (this.activeIndex < this.children.length - 1) {
        this.activeIndex += step;
      } else if (this.options.backToOpposite) {
        this.activeIndex = 0;
      }

      this._emitSlideEvent();

      this._setItemsPosition();

      resetAutoplay && this.options.autoplay.enabled ? this.play() : '';
    }

    prev(step = 1, resetAutoplay = true) {
      if (this.isResizing || this.activeIndex === 0 && !this.options.backToOpposite) return;
      Axentix.createEvent(this.el, 'caroulix.prev', {
        step
      });
      this.isAnimated = true;
      resetAutoplay && this.options.autoplay.enabled ? this.stop() : '';

      if (this.activeIndex > 0) {
        this.activeIndex -= step;
      } else if (this.options.backToOpposite) {
        this.activeIndex = this.children.length - 1;
      }

      this._emitSlideEvent();

      this._setItemsPosition();

      resetAutoplay && this.options.autoplay.enabled ? this.play() : '';
    }

  }

  Axentix.Config.registerComponent({
    class: Caroulix,
    name: 'Caroulix',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.caroulix:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Collapsible
   * @class
   */
  class Collapsible extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        sidenav: {
          activeClass: true,
          activeWhenOpen: true,
          autoClose: true
        }
      };
    }
    /**
     * Construct Collapsible instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Collapsible',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Collapsible', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Collapsible init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'collapsible.setup');
      this.collapsibleTriggers = document.querySelectorAll('.collapsible-trigger');
      this.isInitialStart = true;
      this.isActive = this.el.classList.contains('active') ? true : false;
      this.isAnimated = false;
      this.isInSidenav = false;
      this.childIsActive = false;

      this._setupListeners();

      this.el.style.transitionDuration = this.options.animationDuration + 'ms';

      this._detectSidenav();

      this._detectChild();

      this.options.sidenav.activeClass ? this._addActiveInSidenav() : '';
      this.isActive ? this.open() : '';
      this.isInitialStart = false;
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.listenerRef = this._onClickTrigger.bind(this);
      this.collapsibleTriggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          trigger.addEventListener('click', this.listenerRef);
        }
      });
      this.resizeRef = this._handleResize.bind(this);
      window.addEventListener('resize', this.resizeRef);
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      this.collapsibleTriggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          trigger.removeEventListener('click', this.listenerRef);
        }
      });
      this.listenerRef = undefined;
      window.removeEventListener('resize', this.resizeRef);
      this.resizeRef = undefined;
    }
    /**
     * Reset collapsible maxHeight
     */


    _handleResize() {
      this.isActive && !this.isInSidenav ? this.el.style.maxHeight = this.el.scrollHeight + 'px' : '';
    }
    /**
     * Check if collapsible is in sidenav
     */


    _detectSidenav() {
      var sidenavElem = this.el.closest('.sidenav');

      if (sidenavElem) {
        this.isInSidenav = true;
        this.sidenavId = sidenavElem.id;
      }
    }
    /**
     * Check if collapsible have active childs
     */


    _detectChild() {
      for (var child of this.el.children) {
        if (child.classList.contains('active')) {
          this.childIsActive = true;
          break;
        }
      }
    }
    /**
     * Add active class to trigger and collapsible
     */


    _addActiveInSidenav() {
      if (this.childIsActive && this.isInSidenav) {
        var triggers = document.querySelectorAll('.sidenav .collapsible-trigger');
        triggers.forEach(trigger => {
          if (trigger.dataset.target === this.el.id) {
            trigger.classList.add('active');
          }
        });
        this.el.classList.add('active');
        this.open();
        this.isActive = true;
      }
    }
    /**
     * Enable / disable active state to trigger when collapsible is in sidenav
     * @param {boolean} state enable or disable
     */


    _addActiveToTrigger(state) {
      var triggers = document.querySelectorAll('.sidenav .collapsible-trigger');
      triggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          state ? trigger.classList.add('active') : trigger.classList.remove('active');
        }
      });
    }
    /**
     * Auto close others collapsible
     */


    _autoClose() {
      if (!this.isInitialStart && this.isInSidenav) {
        Axentix.getInstanceByType('Collapsible').map(collapsible => {
          if (collapsible.isInSidenav && collapsible.sidenavId === this.sidenavId && collapsible.el.id !== this.el.id) {
            collapsible.close();
          }
        });
      }
    }
    /**
     * Apply overflow hidden and automatically remove
     */


    _applyOverflow() {
      this.el.style.overflow = 'hidden';
      setTimeout(() => {
        this.el.style.overflow = '';
      }, this.options.animationDuration);
    }
    /**
     * Handle click on trigger
     * @param {Event} e
     */


    _onClickTrigger(e) {
      e.preventDefault();

      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }
    /**
     * Open collapsible
     */


    open() {
      if (this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'collapsible.open');
      this.isActive = true;
      this.isAnimated = true;
      this.el.style.display = 'block';

      this._applyOverflow();

      this.el.style.maxHeight = this.el.scrollHeight + 'px';
      this.options.sidenav.activeWhenOpen ? this._addActiveToTrigger(true) : '';
      this.options.sidenav.autoClose ? this._autoClose() : '';
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
    }
    /**
     * Close collapsible
     */


    close() {
      if (!this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'collapsible.close');
      this.isAnimated = true;
      this.el.style.maxHeight = '';

      this._applyOverflow();

      this.options.sidenav.activeWhenOpen ? this._addActiveToTrigger(false) : '';
      setTimeout(() => {
        this.el.style.display = '';
        this.isAnimated = false;
        this.isActive = false;
      }, this.options.animationDuration);
    }

  }

  Axentix.Config.registerComponent({
    class: Collapsible,
    name: 'Collapsible',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.collapsible:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Dropdown
   * @class
   */
  class Dropdown extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        animationType: 'none',
        hover: false,
        autoClose: true,
        preventViewport: false
      };
    }
    /**
     * Construct Dropdown instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Dropdown',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Dropdown', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Dropdown init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'dropdown.setup');
      this.dropdownContent = this.el.querySelector('.dropdown-content');
      this.dropdownTrigger = this.el.querySelector('.dropdown-trigger');
      this.isAnimated = false;
      this.isActive = this.el.classList.contains('active') ? true : false;
      this.options.hover ? this.el.classList.add('active-hover') : this._setupListeners();
      this.options.preventViewport ? this.el.classList.add('dropdown-vp') : '';

      this._setupAnimation();
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      if (this.options.hover) {
        return;
      }

      this.listenerRef = this._onClickTrigger.bind(this);
      this.dropdownTrigger.addEventListener('click', this.listenerRef);
      this.documentClickRef = this._onDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickRef, true);
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      if (this.options.hover) {
        return;
      }

      this.dropdownTrigger.removeEventListener('click', this.listenerRef);
      this.listenerRef = undefined;
      document.removeEventListener('click', this.documentClickRef, true);
      this.documentClickRef = undefined;
    }
    /**
     * Check and init animation
     */


    _setupAnimation() {
      var animationList = ['none', 'fade'];
      this.options.animationType = this.options.animationType.toLowerCase();
      animationList.includes(this.options.animationType) ? '' : this.options.animationType = 'none';

      if (this.options.animationType !== 'none' && !this.options.hover) {
        if (this.options.hover) {
          this.el.style.animationDuration = this.options.animationDuration + 'ms';
        } else {
          this.el.style.transitionDuration = this.options.animationDuration + 'ms';
        }

        this.el.classList.add('anim-' + this.options.animationType);
      }
    }
    /**
     * Handle click on document click
     */


    _onDocumentClick(e) {
      if (e.target.matches('.dropdown-trigger')) {
        return;
      }

      if (this.isAnimated || !this.isActive) {
        return;
      }

      this.close();
    }
    /**
     * Handle click on trigger
     */


    _onClickTrigger(e) {
      e.preventDefault();

      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }

    _autoClose() {
      Axentix.getInstanceByType('Dropdown').map(dropdown => {
        dropdown.el.id !== this.el.id ? dropdown.close() : '';
      });
    }

    _setContentHeight() {
      var elRect = this.dropdownContent.getBoundingClientRect();
      var bottom = elRect.height - (elRect.bottom - (window.innerHeight || document.documentElement.clientHeight)) - 10;
      this.dropdownContent.style.maxHeight = bottom + 'px';
    }
    /**
     * Open dropdown
     */


    open() {
      if (this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'dropdown.open');
      this.dropdownContent.style.display = 'flex';
      this.options.preventViewport ? this._setContentHeight() : '';
      setTimeout(() => {
        this.el.classList.add('active');
        this.isActive = true;
      }, 10);
      this.options.autoClose ? this._autoClose() : '';

      if (this.options.animationType !== 'none') {
        this.isAnimated = true;
        setTimeout(() => {
          this.isAnimated = false;
          Axentix.createEvent(this.el, 'dropdown.opened');
        }, this.options.animationDuration);
      } else {
        Axentix.createEvent(this.el, 'dropdown.opened');
      }
    }
    /**
     * Close dropdown
     */


    close() {
      if (!this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'dropdown.close');
      this.el.classList.remove('active');

      if (this.options.animationType !== 'none') {
        this.isAnimated = true;
        setTimeout(() => {
          this.dropdownContent.style.display = '';
          this.isAnimated = false;
          this.isActive = false;
          Axentix.createEvent(this.el, 'dropdown.closed');
        }, this.options.animationDuration);
      } else {
        this.dropdownContent.style.display = '';
        this.isAnimated = false;
        this.isActive = false;
        Axentix.createEvent(this.el, 'dropdown.closed');
      }
    }

  }

  Axentix.Config.registerComponent({
    class: Dropdown,
    name: 'Dropdown',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.dropdown:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Fab
   * @class
   */
  class Fab extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        hover: true,
        direction: 'top',
        position: 'bottom-right',
        offsetX: '1rem',
        offsetY: '1.5rem'
      };
    }
    /**
     * Construct Fab instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Fab',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Fab', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Fab init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'fab.setup');
      this.isAnimated = false;
      this.isActive = false;
      this.trigger = document.querySelector('#' + this.el.id + ' .fab-trigger');
      this.fabMenu = document.querySelector('#' + this.el.id + ' .fab-menu');

      this._verifOptions();

      this._setupListeners();

      this.el.style.transitionDuration = this.options.animationDuration + 'ms';

      this._setProperties();
    }
    /**
     * Options check
     */


    _verifOptions() {
      var directionList = ['right', 'left', 'top', 'bottom'];
      directionList.includes(this.options.direction) ? '' : this.options.direction = 'top';
      var positionList = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
      positionList.includes(this.options.position) ? '' : this.options.position = 'bottom-right';
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      if (this.options.hover) {
        this.openRef = this.open.bind(this);
        this.closeRef = this.close.bind(this);
        this.el.addEventListener('mouseenter', this.openRef);
        this.el.addEventListener('mouseleave', this.closeRef);
      } else {
        this.listenerRef = this._onClickTrigger.bind(this);
        this.el.addEventListener('click', this.listenerRef);
      }

      this.documentClickRef = this._handleDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickRef, true);
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      if (this.options.hover) {
        this.el.removeEventListener('mouseenter', this.openRef);
        this.el.removeEventListener('mouseleave', this.closeRef);
        this.openRef = undefined;
        this.closeRef = undefined;
      } else {
        this.el.removeEventListener('click', this.listenerRef);
        this.listenerRef = undefined;
      }

      document.removeEventListener('click', this.documentClickRef, true);
      this.documentClickRef = undefined;
    }
    /**
     * Set different options on element
     */


    _setProperties() {
      this.options.position.split('-')[0] === 'top' ? this.el.style.top = this.options.offsetY : this.el.style.bottom = this.options.offsetY;
      this.options.position.split('-')[1] === 'right' ? this.el.style.right = this.options.offsetX : this.el.style.left = this.options.offsetX;
      this.options.direction === 'top' || this.options.direction === 'bottom' ? '' : this.el.classList.add('fab-dir-x');

      this._setMenuPosition();
    }
    /**
     * Set menu position
     */


    _setMenuPosition() {
      if (this.options.direction === 'top' || this.options.direction === 'bottom') {
        var height = this.trigger.clientHeight;
        this.options.direction === 'top' ? this.fabMenu.style.bottom = height + 'px' : this.fabMenu.style.top = height + 'px';
      } else {
        var width = this.trigger.clientWidth;
        this.options.direction === 'right' ? this.fabMenu.style.left = width + 'px' : this.fabMenu.style.right = width + 'px';
      }
    }
    /**
     * Handle document click event
     * @param {Event} e
     */


    _handleDocumentClick(e) {
      var isInside = this.el.contains(e.target);
      !isInside && this.isActive ? this.close() : '';
    }
    /**
     * Handle click on trigger
     * @param {Event} e
     */


    _onClickTrigger(e) {
      e.preventDefault();

      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }
    /**
     * Open fab
     */


    open() {
      if (this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'fab.open');
      this.isAnimated = true;
      this.isActive = true;
      this.el.classList.add('active');
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
    }
    /**
     * Close fab
     */


    close() {
      if (!this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'fab.close');
      this.isAnimated = true;
      this.isActive = false;
      this.el.classList.remove('active');
      setTimeout(() => {
        this.isAnimated = false;
      }, this.options.animationDuration);
    }

  }

  Axentix.Config.registerComponent({
    class: Fab,
    name: 'Fab',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.fab:not(i):not(.no-axentix-init)'
    }
  });
})();

Axentix.Forms = (() => {
  var isInit = true;
  /**
   * Detect attribute & state of all inputs
   * @param {NodeListOf<Element>} inputElements
   */

  var detectAllInputs = inputElements => {
    inputElements.forEach(detectInput);
  };
  /**
   * Delay detection of all inputs
   * @param {NodeListOf<Element>} inputElements
   */


  var delayDetectionAllInputs = inputElements => {
    if (isInit) {
      isInit = false;
      return;
    }

    setTimeout(() => {
      detectAllInputs(inputElements);
    }, 10);
  };
  /**
   * Detect attribute & state of an input
   * @param {Element} input
   */


  var detectInput = input => {
    var formField = input.parentElement.classList.contains('form-group') ? input.parentElement.parentElement : input.parentElement;
    var isActive = formField.classList.contains('active');
    var hasContent = input.value.length > 0 || input.tagName !== 'SELECT' && input.placeholder.length > 0 || input.tagName === 'SELECT' || input.matches('[type="date"]') || input.matches('[type="month"]') || input.matches('[type="week"]') || input.matches('[type="time"]');
    var isFocused = document.activeElement === input;
    var isDisabled = input.hasAttribute('disabled') || input.hasAttribute('readonly');

    if (input.firstInit) {
      updateInput(input, isActive, hasContent, isFocused, formField);
      input.firstInit = false;
      input.isInit = true;
    } else {
      isDisabled ? '' : updateInput(input, isActive, hasContent, isFocused, formField);
    }
  };
  /**
   * Update input field
   * @param {Element} input
   * @param {boolean} isActive
   * @param {boolean} hasContent
   * @param {boolean} isFocused
   */


  var updateInput = (input, isActive, hasContent, isFocused, formField) => {
    var isTextArea = input.type === 'textarea';

    if (!isActive && (hasContent || isFocused)) {
      formField.classList.add('active');
    } else if (isActive && !(hasContent || isFocused)) {
      formField.classList.remove('active');
    }

    isTextArea ? '' : setFormPosition(input, formField);
    isFocused && !isTextArea ? formField.classList.add('is-focused') : formField.classList.remove('is-focused');
    isFocused && isTextArea ? formField.classList.add('is-txtarea-focused') : formField.classList.remove('is-txtarea-focused');
  };
  /**
   * Add bottom position variable to form
   * @param {Element} input
   * @param {Element} formField
   */


  var setFormPosition = (input, formField) => {
    var inputWidth = input.clientWidth,
        inputLeftOffset = input.offsetLeft;
    var topOffset = input.clientHeight + input.offsetTop + 'px';
    formField.style.setProperty('--form-material-position', topOffset);
    var offset = inputLeftOffset,
        side = 'left',
        width = '100%',
        labelLeft = '0';

    if (formField.classList.contains('form-rtl')) {
      side = 'right';
      offset = formField.clientWidth - inputWidth - inputLeftOffset;
    }

    formField.style.setProperty("--form-material-".concat(side, "-offset"), offset + 'px');
    var label = formField.querySelector('label');

    if (offset != 0) {
      width = inputWidth + 'px';
      labelLeft = inputLeftOffset;
    }

    label.style.left = labelLeft + 'px';
    formField.style.setProperty('--form-material-width', width);
  };
  /**
   * Handle listeners
   * @param {NodeListOf<Element>} inputs
   * @param {Event} e
   */


  var handleListeners = (inputs, e) => {
    inputs.forEach(input => {
      input === e.target ? detectInput(input) : '';
    });
  };
  /**
   * Handle form reset event
   * @param {NodeListOf<Element>} inputs
   * @param {Event} e
   */


  var handleResetEvent = (inputs, e) => {
    if (e.target.tagName === 'FORM' && e.target.classList.contains('form-material')) {
      delayDetectionAllInputs(inputs);
    }
  };
  /**
   * Setup forms fields listeners
   * @param {NodeListOf<Element>} inputElements
   */


  var setupFormsListeners = inputElements => {
    inputElements.forEach(input => input.firstInit = true);
    detectAllInputs(inputElements);
    var handleListenersRef = handleListeners.bind(null, inputElements);
    document.addEventListener('focus', handleListenersRef, true);
    document.addEventListener('blur', handleListenersRef, true);
    var delayDetectionAllInputsRef = delayDetectionAllInputs.bind(null, inputElements);
    window.addEventListener('pageshow', delayDetectionAllInputsRef);
    var handleResetRef = handleResetEvent.bind(null, inputElements);
    document.addEventListener('reset', handleResetRef);
    var detectAllInputsRef = detectAllInputs.bind(null, inputElements);
    window.addEventListener('resize', detectAllInputsRef);
  };

  var handleFileInput = (input, filePath) => {
    var files = input.files;

    if (files.length > 1) {
      filePath.innerHTML = Array.from(files).reduce((acc, file) => {
        acc.push(file.name);
        return acc;
      }, []).join(', ');
    } else if (files[0]) {
      filePath.innerHTML = files[0].name;
    }
  };

  var setupFormFile = element => {
    if (element.isInit) {
      return;
    }

    element.isInit = true;
    var input = element.querySelector('input[type="file"]');
    var filePath = element.querySelector('.form-file-path');
    input.handleRef = handleFileInput.bind(null, input, filePath);
    input.addEventListener('change', input.handleRef);
  };

  var updateInputsFile = () => {
    var elements = Array.from(document.querySelectorAll('.form-file'));

    try {
      elements.map(setupFormFile);
    } catch (error) {
      console.error('[Axentix] Form file error', error);
    }
  };
  /**
   * Update inputs state
   * @param {NodeListOf<Element>} inputElements
   */


  Axentix.updateInputs = (inputElements = document.querySelectorAll('.form-material .form-field:not(.form-default) .form-control')) => {
    var setupInputs = Array.from(inputElements).filter(el => !el.isInit);
    var detectInputs = Array.from(inputElements).filter(el => el.isInit);
    updateInputsFile();

    try {
      setupInputs.length > 0 ? setupFormsListeners(setupInputs) : '';
      detectInputs.length > 0 ? detectAllInputs(detectInputs) : '';
    } catch (error) {
      console.error('[Axentix] Material forms error', error);
    }
  };
})(); // Init


document.addEventListener('DOMContentLoaded', () => Axentix.updateInputs());

(() => {
  /**
   * Class lightbox
   * @class
   */
  class Lightbox extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 400,
        overlayColor: 'grey dark-4',
        offset: 150,
        mobileOffset: 80,
        caption: ''
      };
    }
    /**
     * Construct Lightbox instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Lightbox',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Lightbox', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Lightbox init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'lightbox.setup');
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';
      this.container = Axentix.wrap([this.el]);

      this._setupListeners();
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.openOnClickRef = this.open.bind(this);
      this.el.addEventListener('click', this.openOnClickRef);
      this.closeEventRef = this.close.bind(this);
      window.addEventListener('keyup', this.closeEventRef);
      window.addEventListener('scroll', this.closeEventRef);
      window.addEventListener('resize', this.closeEventRef);
    }
    /**
     * Remove event listeners
     */


    _removeListeners() {
      this.el.removeEventListener('click', this.openOnClickRef);
      window.removeEventListener('keyup', this.closeEventRef);
      window.removeEventListener('scroll', this.closeEventRef);
      window.removeEventListener('resize', this.closeEventRef);
      this.openOnClickRef = undefined;
      this.onResizeRef = undefined;
      this.closeEventRef = undefined;
    }

    _setOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.style.transitionDuration = this.options.animationDuration + 'ms';
      this.overlay.className = 'lightbox-overlay ' + this.options.overlayColor;
      this.container.appendChild(this.overlay);

      if (this.options.caption) {
        this.caption = document.createElement('p');
        this.caption.className = 'lightbox-caption';
        this.caption.innerHTML = this.options.caption;
        this.overlay.appendChild(this.caption);
      }

      this.overlayClickEventRef = this.close.bind(this);
      this.overlay.addEventListener('click', this.overlayClickEventRef);
    }

    _showOverlay() {
      this.overlay.style.opacity = 1;
    }

    _unsetOverlay() {
      this.overlay.style.opacity = 0;
      this.overlay.removeEventListener('click', this.overlayClickEventRef);
      setTimeout(() => {
        this.overlay.remove();
      }, this.options.animationDuration);
    }

    _calculateRatio() {
      var offset = window.innerWidth >= 960 ? this.options.offset : this.options.mobileOffset;

      if (window.innerWidth / window.innerHeight >= this.basicWidth / this.basicHeight) {
        this.newHeight = window.innerHeight - offset;
        this.newWidth = this.newHeight * this.basicWidth / this.basicHeight;
      } else {
        this.newWidth = window.innerWidth - offset;
        this.newHeight = this.newWidth * this.basicHeight / this.basicWidth;
      }
    }

    _setOverflowParents() {
      this.overflowParents = [];

      for (var elem = this.el; elem && elem !== document; elem = elem.parentNode) {
        var elementSyle = window.getComputedStyle(elem);

        if (elementSyle.overflow === 'hidden' || elementSyle.overflowX === 'hidden' || elementSyle.overflowY === 'hidden') {
          this.overflowParents.push(elem);
          elem.style.setProperty('overflow', 'visible', 'important');
          document.body.style.overflowX = 'hidden';
        }
      }
    }

    _unsetOverflowParents() {
      this.overflowParents.map(parent => parent.style.overflow = '');
      document.body.style.overflowX = '';
    }
    /**
     * Set position of active lightbox
     */


    open() {
      if (this.isActive) {
        this.close();
        return;
      } else if (this.isAnimated) {
        return;
      }

      var element = this.el;
      this.overflowElements = [];

      this._setOverflowParents();

      var centerTop = window.innerHeight / 2;
      var centerLeft = window.innerWidth / 2;
      var rect = this.el.getBoundingClientRect();
      var containerRect = this.el.getBoundingClientRect();
      this.basicWidth = rect.width;
      this.el.style.width = this.basicWidth + 'px';
      this.basicHeight = rect.height;
      this.el.style.height = this.basicHeight + 'px';
      this.el.style.top = 0;
      this.el.style.left = 0;
      this.newTop = centerTop + window.scrollY - (containerRect.top + window.scrollY);
      this.newLeft = centerLeft + window.scrollX - (containerRect.left + window.scrollX);

      this._calculateRatio();

      this.container.style.position = 'relative';

      this._setOverlay();

      setTimeout(() => {
        Axentix.createEvent(this.el, 'lightbox.open');
        this.isAnimated = true;
        this.el.classList.add('active');

        if (this.el.classList.contains('responsive-media')) {
          this.el.classList.remove('responsive-media');
          this.isResponsive = true;
        } else {
          this.isResponsive = false;
        }

        this.isActive = true;

        this._showOverlay();

        this.container.style.width = this.basicWidth + 'px';
        this.container.style.height = this.basicHeight + 'px';
        this.el.style.width = this.newWidth + 'px';
        this.el.style.height = this.newHeight + 'px';
        this.el.style.top = this.newTop - this.newHeight / 2 + 'px';
        this.el.style.left = this.newLeft - this.newWidth / 2 + 'px';
        this.isAnimated = false;
      }, 50);
      setTimeout(() => {
        Axentix.createEvent(this.el, 'lightbox.opened');
      }, this.options.animationDuration + 50);
    }
    /**
     * Unset active lightbox
     */


    close(e) {
      if (!this.isActive || e && e.key && e.key !== 'Escape') {
        return;
      } else if (this.isAnimated) {
        return;
      }

      this.isAnimated = true;
      this.el.style.top = 0;
      this.el.style.left = 0;
      this.el.style.width = this.basicWidth + 'px';
      this.el.style.height = this.basicHeight + 'px';

      this._unsetOverlay();

      Axentix.createEvent(this.el, 'lightbox.close');
      setTimeout(() => {
        this.el.classList.remove('active');
        this.isResponsive ? this.el.classList.add('responsive-media') : '';
        this.container.removeAttribute('style');
        this.el.style.left = '';
        this.el.style.top = '';
        this.el.style.width = '';
        this.el.style.height = '';
        this.el.style.transform = '';

        this._unsetOverflowParents();

        this.isActive = false;
        this.isAnimated = false;
        Axentix.createEvent(this.el, 'lightbox.closed');
      }, this.options.animationDuration + 50);
    }

  }

  Axentix.Config.registerComponent({
    class: Lightbox,
    name: 'Lightbox',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.lightbox:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Modal
   * @class
   */
  class Modal extends AxentixComponent {
    static getDefaultOptions() {
      return {
        overlay: true,
        bodyScrolling: false,
        animationDuration: 400
      };
    }
    /**
     * Construct Modal instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Modal',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Modal', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Modal init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'modal.setup');
      this.modalTriggers = document.querySelectorAll('.modal-trigger');
      this.isActive = this.el.classList.contains('active') ? true : false;
      this.isAnimated = false;

      this._setupListeners();

      this.options.overlay ? this._createOverlay() : '';
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';
      this.el.style.animationDuration = this.options.animationDuration + 'ms';
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.listenerRef = this._onClickTrigger.bind(this);
      this.modalTriggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          trigger.addEventListener('click', this.listenerRef);
        }
      });
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      this.modalTriggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          trigger.removeEventListener('click', this.listenerRef);
        }
      });
      this.listenerRef = undefined;
    }
    /**
     * Create overlay element
     */


    _createOverlay() {
      if (this.isActive && this.options.overlay) {
        this.overlayElement = document.querySelector('.modal-overlay[data-target="' + this.el.id + '"]');
        this.overlayElement ? '' : this.overlayElement = document.createElement('div');
      } else {
        this.overlayElement = document.createElement('div');
      }

      this.overlayElement.classList.add('modal-overlay');
      this.overlayElement.style.transitionDuration = this.options.animationDuration + 'ms';
      this.overlayElement.dataset.target = this.el.id;
    }
    /**
     * Enable or disable body scroll when option is true
     * @param {boolean} state Enable or disable body scroll
     */


    _toggleBodyScroll(state) {
      if (!this.options.bodyScrolling) {
        state ? document.body.style.overflow = '' : document.body.style.overflow = 'hidden';
      }
    }
    /**
     * Set Z-Index when modal is open
     */


    _setZIndex() {
      var totalModals = document.querySelectorAll('.modal.active').length + 1;
      this.options.overlay ? this.overlayElement.style.zIndex = 800 + totalModals * 6 : '';
      this.el.style.zIndex = 800 + totalModals * 10;
    }
    /**
     * Handle click on trigger
     */


    _onClickTrigger(e) {
      e.preventDefault();

      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }
    /**
     * Open the modal
     */


    open() {
      if (this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'modal.open');
      this.isActive = true;
      this.isAnimated = true;

      this._setZIndex();

      this.el.style.display = 'block';
      this.overlay(true);

      this._toggleBodyScroll(false);

      setTimeout(() => {
        this.el.classList.add('active');
      }, 50);
      setTimeout(() => {
        this.isAnimated = false;
        Axentix.createEvent(this.el, 'modal.opened');
      }, this.options.animationDuration);
    }
    /**
     * Close the modal
     */


    close() {
      if (!this.isActive) {
        return;
      }

      Axentix.createEvent(this.el, 'modal.close');
      this.isAnimated = true;
      this.el.classList.remove('active');
      this.overlay(false);
      setTimeout(() => {
        this.el.style.display = '';
        this.isAnimated = false;
        this.isActive = false;

        this._toggleBodyScroll(true);

        Axentix.createEvent(this.el, 'modal.closed');
      }, this.options.animationDuration);
    }
    /**
     * Manage overlay
     * @param {boolean} state
     */


    overlay(state) {
      if (this.options.overlay) {
        if (state) {
          this.overlayElement.addEventListener('click', this.listenerRef);
          document.body.appendChild(this.overlayElement);
          setTimeout(() => {
            this.overlayElement.classList.add('active');
          }, 50);
        } else {
          this.overlayElement.classList.remove('active');
          setTimeout(() => {
            this.overlayElement.removeEventListener('click', this.listenerRef);
            document.body.removeChild(this.overlayElement);
          }, this.options.animationDuration);
        }
      }
    }

  }

  Axentix.Config.registerComponent({
    class: Modal,
    name: 'Modal',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.modal:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class ScrollSpy
   * @class
   */
  class ScrollSpy extends AxentixComponent {
    static getDefaultOptions() {
      return {
        offset: 200,
        linkSelector: 'a',
        classes: 'active',
        auto: {
          enabled: false,
          classes: '',
          selector: ''
        }
      };
    }
    /**
     * Construct ScrollSpy instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'ScrollSpy',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('ScrollSpy', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] ScrollSpy init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'scrollspy.setup');
      this.options.auto.enabled ? this._setupAuto() : this._setupBasic();
      this.options.classes = this.options.classes.split(' ');
      this.oldLink = '';

      this._setupListeners();

      this._update();
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.updateRef = this._update.bind(this);
      window.addEventListener('scroll', this.updateRef);
      window.addEventListener('resize', this.updateRef);
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      window.removeEventListener('scroll', this.updateRef);
      window.removeEventListener('resize', this.updateRef);
      this.updateRef = undefined;
    }

    _setupBasic() {
      this.links = Array.from(this.el.querySelectorAll(this.options.linkSelector));
      this.elements = this.links.map(link => document.querySelector(link.getAttribute('href')));
    }

    _setupAuto() {
      this.elements = Array.from(document.querySelectorAll(this.options.auto.selector));
      this.links = this.elements.map(el => {
        var link = document.createElement('a');
        link.className = this.options.auto.classes;
        link.setAttribute('href', '#' + el.id);
        link.innerHTML = el.innerHTML;
        this.el.appendChild(link);
        return link;
      });
    }

    _getElement() {
      var top = window.scrollY,
          left = window.scrollX,
          right = window.innerWidth,
          bottom = window.innerHeight,
          topBreakpoint = top + this.options.offset;

      if (bottom + top >= document.body.offsetHeight - 2) {
        return this.elements[this.elements.length - 1];
      }

      return this.elements.find(el => {
        var elRect = el.getBoundingClientRect();
        return elRect.top + top >= top && elRect.left + left >= left && elRect.right <= right && elRect.bottom <= bottom && elRect.top + top <= topBreakpoint;
      });
    }

    _removeOldLink() {
      if (!this.oldLink) {
        return;
      }

      this.options.classes.map(cl => this.oldLink.classList.remove(cl));
    }

    _getClosestElem() {
      var top = window.scrollY;
      return this.elements.reduce((prev, curr) => {
        var currTop = curr.getBoundingClientRect().top + top;
        var prevTop = prev.getBoundingClientRect().top + top;
        return currTop > top + this.options.offset ? prev : Math.abs(currTop - top) < Math.abs(prevTop - top) ? curr : prev;
      });
    }

    _update() {
      var element = this._getElement();

      element ? '' : element = this._getClosestElem();
      var link = this.links.find(link => link.getAttribute('href').split('#')[1] === element.id);

      if (link === this.oldLink) {
        return;
      }

      Axentix.createEvent(this.el, 'scrollspy.update');

      this._removeOldLink();

      this.options.classes.map(cl => link.classList.add(cl));
      this.oldLink = link;
    }

  }

  Axentix.Config.registerComponent({
    class: ScrollSpy,
    name: 'ScrollSpy',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.scrollspy:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Sidenav
   * @class
   */
  class Sidenav extends AxentixComponent {
    static getDefaultOptions() {
      return {
        overlay: true,
        bodyScrolling: false,
        animationDuration: 300
      };
    }
    /**
     * Construct Sidenav instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Sidenav',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Sidenav', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Sidenav init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'sidenav.setup');
      this.sidenavTriggers = document.querySelectorAll('.sidenav-trigger');
      this.isActive = false;
      this.isAnimated = false;
      this.isFixed = this.el.classList.contains('fixed');
      var sidenavFixed = Axentix.getInstanceByType('Sidenav').find(sidenav => sidenav.isFixed);
      this.firstSidenavInit = sidenavFixed && sidenavFixed.el === this.el;
      this.extraClasses = ['sidenav-right', 'sidenav-both', 'sidenav-large', 'sidenav-large-left', 'sidenav-large-right'];
      this.layoutEl = document.querySelector('.layout');
      this.layoutEl && this.firstSidenavInit ? this._cleanLayout() : '';

      this._setupListeners();

      this.options.overlay ? this._createOverlay() : '';
      this.layoutEl && this.isFixed ? this._handleMultipleSidenav() : '';
      this.el.style.transitionDuration = this.options.animationDuration + 'ms';
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.listenerRef = this._onClickTrigger.bind(this);
      this.sidenavTriggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          trigger.addEventListener('click', this.listenerRef);
        }
      });
      this.windowResizeRef = this.close.bind(this);
      window.addEventListener('resize', this.windowResizeRef);
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      this.sidenavTriggers.forEach(trigger => {
        if (trigger.dataset.target === this.el.id) {
          trigger.removeEventListener('click', this.listenerRef);
        }
      });
      this.listenerRef = undefined;
      window.removeEventListener('resize', this.windowResizeRef);
      this.windowResizeRef = undefined;
    }

    destroy() {
      Axentix.createEvent(this.el, 'component.destroy');

      this._removeListeners();

      this.layoutEl ? this._cleanLayout() : '';
      var index = Axentix.instances.findIndex(ins => ins.instance.el.id === this.el.id);
      Axentix.instances.splice(index, 1);
    }

    _cleanLayout() {
      this.extraClasses.map(classes => this.layoutEl.classList.remove(classes));
    }

    _handleMultipleSidenav() {
      if (!this.firstSidenavInit) {
        return;
      }

      var sidenavs = Array.from(document.querySelectorAll('.sidenav')).filter(sidenav => sidenav.classList.contains('fixed'));
      var {
        sidenavsRight,
        sidenavsLeft
      } = sidenavs.reduce((acc, sidenav) => {
        sidenav.classList.contains('right-aligned') ? acc.sidenavsRight.push(sidenav) : acc.sidenavsLeft.push(sidenav);
        return acc;
      }, {
        sidenavsRight: [],
        sidenavsLeft: []
      });
      var isBoth = sidenavsLeft.length > 0 && sidenavsRight.length > 0;
      var sidenavRightLarge = sidenavsRight.some(sidenav => sidenav.classList.contains('large'));
      var sidenavLeftLarge = sidenavsLeft.some(sidenav => sidenav.classList.contains('large'));
      var isLarge = sidenavRightLarge || sidenavLeftLarge;
      isLarge ? this.layoutEl.classList.add('sidenav-large') : '';

      if (sidenavsRight.length > 0 && !isBoth) {
        this.layoutEl.classList.add('sidenav-right');
      } else if (isBoth) {
        this.layoutEl.classList.add('sidenav-both');
      }

      if (isLarge && isBoth) {
        if (sidenavRightLarge && !sidenavLeftLarge) {
          this.layoutEl.classList.add('sidenav-large-right');
        } else if (!sidenavRightLarge && sidenavLeftLarge) {
          this.layoutEl.classList.add('sidenav-large-left');
        }
      }
    }
    /**
     * Create overlay element
     */


    _createOverlay() {
      this.overlayElement = document.createElement('div');
      this.overlayElement.classList.add('sidenav-overlay');
      this.overlayElement.style.transitionDuration = this.options.animationDuration + 'ms';
      this.overlayElement.dataset.target = this.el.id;
    }
    /**
     * Enable or disable body scroll when option is true
     * @param {boolean} state
     */


    _toggleBodyScroll(state) {
      if (!this.options.bodyScrolling) {
        state ? document.body.style.overflow = '' : document.body.style.overflow = 'hidden';
      }
    }
    /**
     * Handle click on trigger
     * @param {Event} e
     */


    _onClickTrigger(e) {
      e.preventDefault();

      if (this.isFixed && window.innerWidth >= 960) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }
    /**
     * Open sidenav
     */


    open() {
      if (this.isActive || this.isAnimated) {
        return;
      }

      Axentix.createEvent(this.el, 'sidenav.open');
      this.isActive = true;
      this.isAnimated = true;
      this.el.classList.add('active');
      this.overlay(true);

      this._toggleBodyScroll(false);

      setTimeout(() => {
        this.isAnimated = false;
        Axentix.createEvent(this.el, 'sidenav.opened');
      }, this.options.animationDuration);
    }
    /**
     * Close sidenav
     */


    close() {
      if (!this.isActive || this.isAnimated) {
        return;
      }

      this.isAnimated = true;
      Axentix.createEvent(this.el, 'sidenav.close');
      this.el.classList.remove('active');
      this.overlay(false);
      setTimeout(() => {
        this._toggleBodyScroll(true);

        this.isActive = false;
        this.isAnimated = false;
        Axentix.createEvent(this.el, 'sidenav.closed');
      }, this.options.animationDuration);
    }
    /**
     * Manage overlay
     * @param {boolean} state
     */


    overlay(state) {
      if (this.options.overlay) {
        if (state) {
          this.overlayElement.addEventListener('click', this.listenerRef);
          document.body.appendChild(this.overlayElement);
          setTimeout(() => {
            this.overlayElement.classList.add('active');
          }, 50);
        } else {
          this.overlayElement.classList.remove('active');
          setTimeout(() => {
            this.overlayElement.removeEventListener('click', this.listenerRef);
            document.body.removeChild(this.overlayElement);
          }, this.options.animationDuration);
        }
      }
    }

  }

  Axentix.Config.registerComponent({
    class: Sidenav,
    name: 'Sidenav',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.sidenav:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Tab
   * @class
   */
  class Tab extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        animationType: 'none',
        disableActiveBar: false,
        caroulix: {}
      };
    }
    /**
     * Construct Tab instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Tab',
          instance: this
        });
        this.caroulixOptions = {
          animationDuration: 300,
          backToOpposite: false,
          enableTouch: false,
          autoplay: {
            enabled: false
          }
        };
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Tab', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Tab init error', error);
      }
    }
    /**
     * Setup component
     */


    _setup() {
      Axentix.createEvent(this.el, 'tab.setup');
      var animationList = ['none', 'slide'];
      animationList.includes(this.options.animationType) ? '' : this.options.animationType = 'none';
      this.isAnimated = false;
      this.tabArrow = this.el.querySelector('.tab-arrow');
      this.tabLinks = this.el.querySelectorAll('.tab-menu .tab-link');
      this.tabMenu = this.el.querySelector('.tab-menu');
      this.currentItemIndex = 0;

      this._getItems();

      if (this.tabArrow) {
        this._toggleArrowMode();

        this.leftArrow = this.el.querySelector('.tab-arrow .tab-prev');
        this.rightArrow = this.el.querySelector('.tab-arrow .tab-next');
      }

      this._setupListeners();

      this.tabMenu.style.transitionDuration = this.options.animationDuration + 'ms';
      this.options.animationType === 'slide' ? this._enableSlideAnimation() : this.updateActiveElement();
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.tabLinks.forEach(item => {
        item.listenerRef = this._onClickItem.bind(this, item);
        item.addEventListener('click', item.listenerRef);
      });
      this.resizeTabListener = this._handleResizeEvent.bind(this);
      window.addEventListener('resize', this.resizeTabListener);

      if (this.tabArrow) {
        this.arrowListener = this._toggleArrowMode.bind(this);
        window.addEventListener('resize', this.arrowListener);
        this.scrollLeftListener = this._scrollLeft.bind(this);
        this.scrollRightLstener = this._scrollRight.bind(this);
        this.leftArrow.addEventListener('click', this.scrollLeftListener);
        this.rightArrow.addEventListener('click', this.scrollRightLstener);
      }
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      this.tabLinks.forEach(item => {
        item.removeEventListener('click', item.listenerRef);
        item.listenerRef = undefined;
      });
      window.removeEventListener('resize', this.resizeTabListener);
      this.resizeTabListener = undefined;

      if (this.tabArrow) {
        window.removeEventListener('resize', this.arrowListener);
        this.arrowListener = undefined;
        this.leftArrow.removeEventListener('click', this.scrollLeftListener);
        this.rightArrow.removeEventListener('click', this.scrollRightLstener);
        this.scrollLeftListener = undefined;
        this.scrollRightLstener = undefined;
      }

      if (this.caroulixSlideRef) {
        this.el.removeEventListener('ax.caroulix.slide', this.caroulixSlideRef);
        this.caroulixSlideRef = undefined;
      }
    }

    _handleResizeEvent() {
      this.updateActiveElement();

      for (var i = 100; i < 500; i += 100) {
        setTimeout(() => {
          this.updateActiveElement();
        }, i);
      }
    }

    _handleCaroulixSlide() {
      if (this.currentItemIndex !== this.caroulixInstance.activeIndex) {
        this.currentItemIndex = this.caroulixInstance.activeIndex;

        this._setActiveElement(this.tabLinks[this.currentItemIndex]);
      }
    }
    /**
     * Get all items
     */


    _getItems() {
      this.tabItems = Array.from(this.tabLinks).map(link => {
        var id = link.children[0].getAttribute('href');
        return this.el.querySelector(id);
      });
    }
    /**
     * Hide all tab items
     */


    _hideContent() {
      this.tabItems.map(item => item.style.display = 'none');
    }
    /**
     * Init slide animation
     */


    _enableSlideAnimation() {
      this.tabItems.map(item => item.classList.add('caroulix-item'));
      this.tabCaroulix = Axentix.wrap(this.tabItems);
      this.tabCaroulix.classList.add('caroulix');
      var nb = Math.random().toString().split('.')[1];
      this.tabCaroulix.id = 'tab-caroulix-' + nb;
      this.tabCaroulixInit = true;
      this.options.caroulix = Axentix.extend(this.caroulixOptions, this.options.caroulix);
      this.options.animationDuration !== 300 ? this.options.caroulix.animationDuration = this.options.animationDuration : '';
      this.updateActiveElement();
    }
    /**
     * Set active bar position
     * @param {Element} element
     */


    _setActiveElement(element) {
      this.tabLinks.forEach(item => item.classList.remove('active'));

      if (!this.options.disableActiveBar) {
        var elementRect = element.getBoundingClientRect();
        var elementPosLeft = elementRect.left;
        var menuPosLeft = this.tabMenu.getBoundingClientRect().left;
        var left = elementPosLeft - menuPosLeft + this.tabMenu.scrollLeft;
        var elementWidth = elementRect.width;
        var right = this.tabMenu.clientWidth - left - elementWidth;
        this.tabMenu.style.setProperty('--tab-bar-left-offset', Math.floor(left) + 'px');
        this.tabMenu.style.setProperty('--tab-bar-right-offset', Math.ceil(right) + 'px');
      }

      element.classList.add('active');
    }
    /**
     * Toggle arrow mode
     */


    _toggleArrowMode() {
      var totalWidth = Array.from(this.tabLinks).reduce((acc, element) => {
        acc += element.clientWidth;
        return acc;
      }, 0);
      var arrowWidth = this.tabArrow.clientWidth;

      if (totalWidth > arrowWidth) {
        this.tabArrow.classList.contains('tab-arrow-show') ? '' : this.tabArrow.classList.add('tab-arrow-show');
      } else {
        this.tabArrow.classList.contains('tab-arrow-show') ? this.tabArrow.classList.remove('tab-arrow-show') : '';
      }

      this.updateActiveElement();
    }
    /**
     * Scroll left
     * @param {Event} e
     */


    _scrollLeft(e) {
      e.preventDefault();
      this.tabMenu.scrollLeft -= 40;
    }
    /**
     * Scroll right
     * @param {Event} e
     */


    _scrollRight(e) {
      e.preventDefault();
      this.tabMenu.scrollLeft += 40;
    }
    /**
     * Handle click on menu item
     * @param {Element} item
     * @param {Event} e
     */


    _onClickItem(item, e) {
      e.preventDefault();

      if (this.isAnimated || item.classList.contains('active')) {
        return;
      }

      var target = item.children[0].getAttribute('href');
      this.select(target.split('#')[1]);
    }

    _getPreviousItemIndex(step) {
      var previousItemIndex = 0;
      var index = this.currentItemIndex;

      for (var i = 0; i < step; i++) {
        if (index > 0) {
          previousItemIndex = index - 1;
          index--;
        } else {
          index = this.tabLinks.length - 1;
          previousItemIndex = index;
        }
      }

      return previousItemIndex;
    }

    _getNextItemIndex(step) {
      var nextItemIndex = 0;
      var index = this.currentItemIndex;

      for (var i = 0; i < step; i++) {
        if (index < this.tabLinks.length - 1) {
          nextItemIndex = index + 1;
          index++;
        } else {
          index = 0;
          nextItemIndex = index;
        }
      }

      return nextItemIndex;
    }
    /**
     * Select tab
     * @param {String} itemId
     */


    select(itemId) {
      if (this.isAnimated) {
        return;
      }

      this.isAnimated = true;
      var menuItem = this.el.querySelector('.tab-menu a[href="#' + itemId + '"]');
      this.currentItemIndex = Array.from(this.tabLinks).findIndex(item => item.children[0] === menuItem);
      Axentix.createEvent(menuItem, 'tab.select', {
        currentIndex: this.currentItemIndex
      });

      this._setActiveElement(menuItem.parentElement);

      if (this.tabCaroulixInit) {
        this.tabItems.map(item => item.id === itemId ? item.classList.add('active') : '');
        this.caroulixInstance = new Axentix.Caroulix('#' + this.tabCaroulix.id, this.options.caroulix, this.el, true);
        this.caroulixSlideRef = this._handleCaroulixSlide.bind(this);
        this.el.addEventListener('ax.caroulix.slide', this.caroulixSlideRef);
        this.tabCaroulixInit = false;
        this.isAnimated = false;
        return;
      }

      if (this.options.animationType === 'slide') {
        var nb = this.tabItems.findIndex(item => item.id === itemId);
        this.caroulixInstance.goTo(nb);
        setTimeout(() => {
          this.isAnimated = false;
        }, this.options.animationDuration);
      } else {
        this._hideContent();

        this.tabItems.map(item => item.id === itemId ? item.style.display = 'block' : '');
        this.isAnimated = false;
      }
    }
    /**
     * Detect active element & update component
     */


    updateActiveElement() {
      var itemSelected;
      this.tabLinks.forEach((item, index) => {
        item.classList.contains('active') ? (itemSelected = item, this.currentItemIndex = index) : '';
      });
      itemSelected ? '' : (itemSelected = this.tabLinks.item(0), this.currentItemIndex = 0);
      var target = itemSelected.children[0].getAttribute('href');
      this.tabSelected = target;
      this.select(target.split('#')[1]);
    }
    /**
     * Go to previous tab
     */


    prev(step = 1) {
      if (this.isAnimated) {
        return;
      }

      var previousItemIndex = this._getPreviousItemIndex(step);

      this.currentItemIndex = previousItemIndex;
      Axentix.createEvent(this.el, 'tab.prev', {
        step
      });
      var target = this.tabLinks[previousItemIndex].children[0].getAttribute('href');
      this.select(target.split('#')[1]);
    }
    /**
     * Go to next tab
     */


    next(step = 1) {
      if (this.isAnimated) {
        return;
      }

      var nextItemIndex = this._getNextItemIndex(step);

      this.currentItemIndex = nextItemIndex;
      Axentix.createEvent(this.el, 'tab.next', {
        step
      });
      var target = this.tabLinks[nextItemIndex].children[0].getAttribute('href');
      this.select(target.split('#')[1]);
    }

  }

  Axentix.Config.registerComponent({
    class: Tab,
    name: 'Tab',
    dataDetection: true,
    autoInit: {
      enabled: true,
      selector: '.tab:not(.no-axentix-init)'
    }
  });
})();

(() => {
  /**
   * Class Toast
   * @class
   */
  class Toast {
    static getDefaultOptions() {
      return {
        animationDuration: 400,
        duration: 4000,
        classes: '',
        position: 'right',
        direction: 'top',
        mobileDirection: 'bottom',
        offset: {
          x: '5%',
          y: '0%',
          mobileX: '10%',
          mobileY: '0%'
        },
        isClosable: false
      };
    }
    /**
     * Construct Toast instance
     * @constructor
     * @param {String} content
     * @param {Object} options
     */


    constructor(content, options) {
      if (Axentix.getInstanceByType('Toast').length > 0) {
        console.error("[Axentix] Toast: Don't try to create multiple toast instances");
        return;
      }

      Axentix.instances.push({
        type: 'Toast',
        instance: this
      });
      this.content = content;
      this.options = Axentix.getComponentOptions('Toast', options, '', true);
      this.options.position = this.options.position.toLowerCase();
      this.options.direction = this.options.direction.toLowerCase();
      this.options.mobileDirection = this.options.mobileDirection.toLowerCase();
      this.toasters = {};
    }

    destroy() {
      Axentix.createEvent(this.el, 'component.destroy');
      var index = Axentix.instances.findIndex(ins => ins.instance.el.id === this.el.id);
      Axentix.instances.splice(index, 1);
    }
    /**
     * Create toast container
     */


    _createToaster() {
      var toaster = document.createElement('div');
      var positionList = ['right', 'left'];
      positionList.includes(this.options.position) ? '' : this.options.position = 'right';
      this.options.position === 'right' ? toaster.style.right = this.options.offset.x : toaster.style.left = this.options.offset.x;
      var directionList = ['bottom', 'top'];
      directionList.includes(this.options.direction) ? '' : this.options.direction = 'top';
      this.options.direction === 'top' ? toaster.style.top = this.options.offset.y : toaster.style.bottom = this.options.offset.y;
      directionList.includes(this.options.mobileDirection) ? '' : this.options.mobileDirection = 'bottom';
      toaster.style.setProperty('--toaster-width', 100 - this.options.offset.mobileX.slice(0, -1) + '%');
      toaster.className = 'toaster toaster-' + this.options.position + ' toast-' + this.options.direction + ' toaster-m-' + this.options.mobileDirection;
      this.toasters[this.options.position] = toaster;
      document.body.appendChild(toaster);
    }
    /**
     * Remove toast container
     */


    _removeToaster() {
      for (var key in this.toasters) {
        var toaster = this.toasters[key];

        if (toaster.childElementCount <= 0) {
          toaster.remove();
          delete this.toasters[key];
        }
      }
    }
    /**
     * Toast in animation
     * @param {Element} toast
     */


    _fadeInToast(toast) {
      setTimeout(() => {
        Axentix.createEvent(toast, 'toast.show');
        toast.classList.add('toast-animated');
        setTimeout(() => {
          Axentix.createEvent(toast, 'toast.shown');
        }, this.options.animationDuration);
      }, 50);
    }
    /**
     * Toast out animation
     * @param {Element} toast
     */


    _fadeOutToast(toast) {
      setTimeout(() => {
        Axentix.createEvent(toast, 'toast.hide');

        this._hide(toast);
      }, this.options.duration + this.options.animationDuration);
    }
    /**
     * Anim out toast
     * @param {Element} toast
     */


    _animOut(toast) {
      toast.style.transitionTimingFunction = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';
      toast.style.paddingTop = 0;
      toast.style.paddingBottom = 0;
      toast.style.margin = 0;
      toast.style.height = 0;
    }
    /**
     * Create toast
     */


    _createToast() {
      var toast = document.createElement('div');
      toast.className = 'toast shadow-1 ' + this.options.classes;
      toast.innerHTML = this.content;
      toast.style.transitionDuration = this.options.animationDuration + 'ms';

      if (this.options.isClosable) {
        var trigger = document.createElement('i');
        trigger.className = 'toast-trigger fas fa-times';
        trigger.listenerRef = this._hide.bind(this, toast, trigger);
        trigger.addEventListener('click', trigger.listenerRef);
        toast.appendChild(trigger);
      }

      this._fadeInToast(toast);

      this.toasters[this.options.position].appendChild(toast);

      this._fadeOutToast(toast);

      var height = toast.clientHeight;
      toast.style.height = height + 'px';
    }
    /**
     * Hide toast
     * @param {String} toast
     * @param {Element} trigger
     * @param {Event} e
     */


    _hide(toast, trigger, e) {
      if (toast.isAnimated) {
        return;
      }

      var timer = 1;

      if (e) {
        e.preventDefault();
        timer = 0;
        this.options.isClosable ? trigger.removeEventListener('click', trigger.listenerRef) : '';
      }

      toast.style.opacity = 0;
      toast.isAnimated = true;
      var delay = timer * this.options.animationDuration + this.options.animationDuration;
      setTimeout(() => {
        this._animOut(toast);
      }, delay / 2);
      setTimeout(() => {
        toast.remove();
        Axentix.createEvent(toast, 'toast.remove');

        this._removeToaster();
      }, delay * 1.45);
    }
    /**
     * Showing the toast
     */


    show() {
      try {
        if (!Object.keys(this.toasters).includes(this.options.position)) {
          this._createToaster();
        }

        this._createToast();
      } catch (error) {
        console.error('[Axentix] Toast error', error);
      }
    }
    /**
     * Change
     * @param {String} content
     * @param {Object} options
     */


    change(content, options) {
      this.content = content;
      this.options = Axentix.extend(this.options, options);
    }

  }

  Axentix.Config.registerComponent({
    class: Toast,
    name: 'Toast'
  });
})();

(() => {
  /**
   * Class Tooltip
   * @Class
   */
  class Tooltip extends AxentixComponent {
    static getDefaultOptions() {
      return {
        content: '',
        animationDelay: 0,
        offset: '10px',
        animationDuration: 200,
        classes: 'grey dark-4 light-shadow-2 p-2',
        position: 'top'
      };
    }
    /**
     * Tooltip constructor
     * @constructor
     * @param {Object} options
     */


    constructor(element, options, isLoadedWithData) {
      super();

      try {
        this.preventDbInstance(element);
        Axentix.instances.push({
          type: 'Tooltip',
          instance: this
        });
        this.el = document.querySelector(element);
        this.options = Axentix.getComponentOptions('Tooltip', options, this.el, isLoadedWithData);

        this._setup();
      } catch (error) {
        console.error('[Axentix] Tooltip init error', error);
      }
    }

    _setup() {
      if (!this.options.content) {
        return console.error('Tooltip #' + this.el.id + ' : empty content.');
      }

      Axentix.createEvent(this.el, 'tooltip.setup');
      this.options.position = this.options.position.toLowerCase();
      var tooltips = document.querySelectorAll('.tooltip');
      tooltips.forEach(tooltip => {
        tooltip.dataset.tooltipId ? tooltip.dataset.tooltipId === this.el.id ? this.tooltip = tooltip : '' : '';
      });
      this.tooltip ? '' : this.tooltip = document.createElement('div');
      this.tooltip.dataset.tooltipId === this.el.id ? '' : this.tooltip.dataset.tooltipId = this.el.id;

      this._setProperties();

      document.body.appendChild(this.tooltip);
      this.positionList = ['right', 'left', 'top', 'bottom'];
      this.positionList.includes(this.options.position) ? '' : this.options.position = 'top';

      this._setupListeners();

      this.updatePosition();
    }
    /**
     * Setup listeners
     */


    _setupListeners() {
      this.listenerEnterRef = this._onHover.bind(this);
      this.listenerLeaveRef = this._onHoverOut.bind(this);
      this.el.addEventListener('mouseenter', this.listenerEnterRef);
      this.el.addEventListener('mouseleave', this.listenerLeaveRef);
    }
    /**
     * Remove listeners
     */


    _removeListeners() {
      this.el.removeEventListener('mouseenter', this.listenerEnterRef);
      this.el.removeEventListener('mouseleave', this.listenerLeaveRef);
      this.listenerEnterRef = undefined;
      this.listenerLeaveRef = undefined;
    }
    /**
     * Set properties to tooltip
     */


    _setProperties() {
      this.tooltip.style.transform = 'translate(0)';
      this.tooltip.style.opacity = 0;
      this.tooltip.className = 'tooltip ' + this.options.classes;
      this.tooltip.style.transitionDuration = this.options.animationDuration + 'ms';
      this.tooltip.innerHTML = this.options.content;
    }
    /**
     * Set basic tooltip position
     */


    _setBasicPosition() {
      if (this.options.position == 'top' || this.options.position == 'bottom') {
        this.options.position == 'top' ? this.tooltip.style.top = this.elRect.top + 'px' : this.tooltip.style.top = this.elRect.top + this.elRect.height + 'px';
      } else if (this.options.position == 'left' || this.options.position == 'right') {
        this.options.position == 'right' ? this.tooltip.style.left = this.elRect.left + this.elRect.width + 'px' : '';
      }
    }
    /**
     * Manually transform the tooltip location
     */


    _manualTransform() {
      if (this.options.position == 'top' || this.options.position == 'bottom') {
        this.tooltip.style.left = this.elRect.left + this.elRect.width / 2 - this.tooltipRect.width / 2 + 'px';
      } else if (this.options.position == 'left' || this.options.position == 'right') {
        this.tooltip.style.top = this.elRect.top + this.elRect.height / 2 - this.tooltipRect.height / 2 + 'px';
      }

      if (this.options.position == 'top') {
        this.tooltip.style.top = this.tooltipRect.top - this.tooltipRect.height + 'px';
      } else if (this.options.position == 'left') {
        this.tooltip.style.left = this.elRect.left - this.tooltipRect.width + 'px';
      }

      var scrollY = window.scrollY;
      var tooltipTop = parseFloat(this.tooltip.style.top);
      this.options.position === 'top' ? this.tooltip.style.top = scrollY * 2 + tooltipTop + 'px' : this.tooltip.style.top = scrollY + tooltipTop + 'px';
    }
    /**
     * Handle hover event
     * @param {Event} e
     */


    _onHover(e) {
      e.preventDefault();
      this.show();
    }
    /**
     * Handle hover event
     * @param {Event} e
     */


    _onHoverOut(e) {
      e.preventDefault();
      this.hide();
    }
    /**
     * Update current tooltip position
     */


    updatePosition() {
      this.elRect = this.el.getBoundingClientRect();

      this._setBasicPosition();

      this.tooltipRect = this.tooltip.getBoundingClientRect();

      this._manualTransform();
    }
    /**
     * Show tooltip
     */


    show() {
      this.updatePosition();
      setTimeout(() => {
        Axentix.createEvent(this.el, 'tooltip.show');
        this.options.position == 'top' ? this.tooltip.style.transform = "translateY(-".concat(this.options.offset, ")") : this.options.position == 'right' ? this.tooltip.style.transform = "translateX(".concat(this.options.offset, ")") : this.options.position == 'bottom' ? this.tooltip.style.transform = "translateY(".concat(this.options.offset, ")") : this.options.position == 'left' ? this.tooltip.style.transform = "translateX(-".concat(this.options.offset, ")") : '';
        this.tooltip.style.opacity = 1;
      }, this.options.animationDelay);
    }
    /**
     * Hide tooltip
     */


    hide() {
      Axentix.createEvent(this.el, 'tooltip.hide');
      this.tooltip.style.transform = 'translate(0)';
      this.tooltip.style.opacity = 0;
    }
    /**
     * Change current options
     * @param {Object} options
     */


    change(options = {}) {
      this.options = Axentix.getComponentOptions('Tooltip', options, this.el, true);
      this.positionList.includes(this.options.position) ? '' : this.options.position = 'top';

      this._setProperties();

      this.updatePosition();
    }

  }

  Axentix.Config.registerComponent({
    class: Tooltip,
    name: 'Tooltip',
    dataDetection: true
  });
})();

Axentix.extend = (...args) => {
  return args.reduce((acc, obj) => {
    for (var key in obj) {
      typeof obj[key] === 'object' && obj[key] !== null ? acc[key] = Axentix.extend(acc[key], obj[key]) : acc[key] = obj[key];
    }

    return acc;
  }, {});
};

Axentix.getComponentOptions = (component, options, el, isLoadedWithData) => Axentix.extend(Axentix[component].getDefaultOptions(), isLoadedWithData ? {} : Axentix.DataDetection.formatOptions(component, el), options);

Axentix.wrap = (target, wrapper = document.createElement('div')) => {
  var parent = target[0].parentElement;
  parent.insertBefore(wrapper, target[0]);
  target.forEach(elem => wrapper.appendChild(elem));
  return wrapper;
};

Axentix.unwrap = wrapper => wrapper.replaceWith(...wrapper.childNodes);

Axentix.createEvent = (element, eventName, extraData) => {
  var event = new CustomEvent('ax.' + eventName, {
    detail: extraData || {},
    bubbles: true
  });
  element.dispatchEvent(event);
};

Axentix.isTouchEnabled = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

Axentix.isPointerEnabled = () => !!window.PointerEvent && 'maxTouchPoints' in window.navigator && window.navigator.maxTouchPoints >= 0;

Axentix.getInstanceByType = type => Axentix.instances.filter(ins => ins.type === type).map(ins => ins.instance);

Axentix.getInstance = element => {
  var el = Axentix.instances.find(ins => ins.type !== 'Toast' && '#' + ins.instance.el.id === element);

  if (el) {
    return el.instance;
  }

  return false;
};

Axentix.getAllInstances = () => Axentix.instances;

Axentix.sync = element => Axentix.getInstance(element).sync();

Axentix.syncAll = () => Axentix.instances.map(ins => ins.instance.sync());

Axentix.reset = element => Axentix.getInstance(element).reset();

Axentix.resetAll = () => Axentix.instances.map(ins => ins.instance.reset());

Axentix.destroy = element => Axentix.getInstance(element).destroy();

Axentix.destroyAll = () => Axentix.instances.map(ins => ins.instance.destroy());

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

/**** Axentix ****/
window.Axentix = __webpack_require__(/*! axentix */ "./node_modules/axentix/dist/js/axentix.esm.js").Axentix;
/** Laravel default */
// window._ = require('lodash');
// try {
//     window.$ = window.jQuery = require('jquery');
// } catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */
//window.axios = require("axios");
//window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */
// import Echo from 'laravel-echo';
// window.Pusher = require('pusher-js');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });

/***/ }),

/***/ "./resources/scss/app.scss":
/*!*********************************!*\
  !*** ./resources/scss/app.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0,
/******/ 			"css/app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/app"], () => (__webpack_require__("./resources/scss/app.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;