sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/Text"
], (Controller, Fragment, Text) => {
  "use strict";

  return Controller.extend("com.intakedashboard.controller.dashboard", {
    onInit() {
      
      const oBotModel = new sap.ui.model.json.JSONModel();
      oBotModel.loadData("model/botData.json"); 
      this.getView().setModel(oBotModel, "botModel");
    },
    onChatBotClick: function () {
      var oView = this.getView();

      if (!this.pChatDialog) {
        this.pChatDialog = Fragment.load({
          id: oView.getId(),
          name: "com.intakedashboard.fragments.ChatbotFragment",
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);

          oDialog.open();

          setTimeout(() => {
            this._triggerGreetingTransition();
          }, 200);

          return oDialog;
        }.bind(this));
      } else {
        this.pChatDialog.then(function (oDialog) {

          oDialog.open();

          setTimeout(() => {
            this._triggerGreetingTransition();
          }, 200);
        }.bind(this));
      }
    },
    _triggerGreetingTransition: function () {
      const oView = this.getView();
      const oGreetingSection = oView.byId("greetingSection");
      const oCompactGreeting = oView.byId("compactGreeting");

      if (oGreetingSection && oCompactGreeting) {
        oGreetingSection.setVisible(true);
        oCompactGreeting.setVisible(false);

        setTimeout(() => {
          oGreetingSection.setVisible(false);
          oCompactGreeting.setVisible(true);

          const oScroll = oView.byId("chatScrollContainer");
          if (oScroll) {
            oScroll.scrollTo(0, 10000, 400);
          }
        }, 2000); // Delay
      } else {
        console.warn("Greeting elements not found.");
      }
    },

    onSendMessage: function (oEvent) {
      const sMessage = oEvent.getParameter("value");
      if (!sMessage) return;
    
      // Show user message with styling
      const oUserMessage = new sap.m.HBox({
        justifyContent: "End", // right-align
        items: [
          new sap.m.Text({
            text: sMessage
          }).addStyleClass("userMessage")
        ]
      });
    
      this.byId("chatContainer").addItem(oUserMessage);
    
      // Clear the input field
      this.byId("userInput").setValue("");
    
      // Simulate bot response
      setTimeout(() => {
        const sBotReply = this._getBotResponse(sMessage);
        this._addBotMessage(sBotReply);
      }, 600);
    
      this._scrollToBottom();
    },
    
    

    _addBotMessage: function (text) {
      const oChatContainer = this.byId("chatContainer");
    
      const oBotMessage = new sap.m.VBox({
        items: [
          new sap.m.HBox({
            justifyContent: "Start",
            items: [
              new sap.m.Text({
                text: text
              }).addStyleClass("botMessage")
            ]
          })
        ]
      }).addStyleClass("messageWrapper");
    
      oChatContainer.addItem(oBotMessage);
    
      setTimeout(() => {
        const oScrollContainer = this.byId("chatScrollContainer");
        if (oScrollContainer) {
          oScrollContainer.scrollTo(0, 10000, 500);
        }
      }, 100);
    },
    _addUserMessage: function (text) {
      const oChatContainer = this.byId("chatContainer");
    
      const oUserMessage = new sap.m.VBox({
        items: [
          new sap.m.HBox({
            justifyContent: "End",
            items: [
              new sap.m.Text({
                text: text
              }).addStyleClass("userMessage")
            ]
          })
        ]
      }).addStyleClass("messageWrapper");
    
      oChatContainer.addItem(oUserMessage);
    },

    _getBotResponse: function (message) {
      const sMsg = message.toLowerCase();
      const oModel = this.getView().getModel("botModel");
      const oResponses = oModel.getProperty("/responses");
    
      const loweredMsg = message.toLowerCase();

     
      for (let key in oResponses) {
        if (loweredMsg.includes(key.toLowerCase())) {
          return oResponses[key];
        }
      }
      return oResponses["default"];
    },
    _scrollToBottom: function () {
      const oScrollContainer = this.byId("chatScrollContainer");
      if (oScrollContainer) {
        setTimeout(() => {
          oScrollContainer.scrollTo(0, 10000, 500); // scroll to bottom smoothly
        }, 100);
      }
    },
    onCloseChatFragment: function () {
      const oChatContainer = this.byId("chatContainer");
      const oInput = this.byId("userInput");
    
     //clear the data
      if (oChatContainer) {
        oChatContainer.removeAllItems();
      }
    
 
      if (oInput) {
        oInput.setValue("");
      }
    
      this.byId("chatDialog").close();
    },
  


  });
});