sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/intakedashboard/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.intakedashboard.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
            const that = this;
            this.sessionId = Math.floor(100000 + Math.random() * 900000);
            
  
        }
    });
});