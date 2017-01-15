export default {
  register: (store) => {
    AFRAME.registerSystem('redux', {
      init: function () {
        this.store = store;
      }
    });
  }
}
