const setComponentProperty = AFRAME.utils.entity.setComponentProperty;


const select = (state, selector) => {
  let value = state;
  selector.split('.').forEach(key => {
    value = value[key];
  });
  return value.toString();
}

export default {
  register: () => {
    /**
     * Bind Redux state to a component property.
     */
    AFRAME.registerComponent('redux-bind', {
      schema: {
        default: {},
        parse: function (value) {
          var data;
          var properties;

          if (value.constructor === Object) { return value; }

          data = {};
          properties = value.split(';');
          properties.forEach(function parsePairs (pairStr) {
            var pair = pairStr.trim().split(':');
            data[pair[0]] = pair[1];
          });
          return data;
        }
      },

      init: function () {
        this.unsubscribe = null;
      },

      update: function () {
        var data = this.data;
        var el = this.el;
        var store;

        // Reset handler.
        if (this.unsubscribe) { this.unsubscribe(); }

        // Subscribe to store and register handler to do data-binding to components.
        store = el.sceneEl.systems.redux.store;
        this.unsubscribe = store.subscribe(handler);
        handler();

        function handler () {
          var state = store.getState();
          Object.keys(data).forEach(function syncComponent (stateSelector) {
            var propertyName = data[stateSelector].trim();
            setComponentProperty(el, propertyName, select(state, stateSelector));
          });
        }
      },

      remove: function () {
        if (this.unsubscribe) { this.unsubscribe(); }
      }
    });
  }
}
