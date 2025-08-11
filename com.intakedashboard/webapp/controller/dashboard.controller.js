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

      const oLaptopModel = new sap.ui.model.json.JSONModel();
      oLaptopModel.loadData("model/laptopData.json");
      this.getView().setModel(oLaptopModel, "laptopModel");
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

      this._addUserMessage(sMessage);
      this.byId("userInput").setValue("");

      setTimeout(() => {
        const oResponse = this._getBotResponse(sMessage);
        this._addBotMessage(oResponse);
      }, 600);

      this._scrollToBottom();
    },

_addBotMessage: function (response) {
    const oChatContainer = this.byId("chatContainer");
    const oVBox = new sap.m.VBox().addStyleClass("messageWrapper");

    // Bot's text reply
    if (response.text) {
        oVBox.addItem(new sap.m.HBox({
            justifyContent: "Start",
            items: [
                new sap.m.Text({ text: response.text }).addStyleClass("botMessage")
            ]
        }));
    }

    if (response.type === "table" && response.dataPath) {
        const oCard = new sap.m.VBox({
            width: "100%",
            items: []
        }).addStyleClass("sapUiSmallMargin cardStyle");

        // Title
        oCard.addItem(new sap.m.Label({
            text: "Select Laptop Battery Model",
            design: "Bold"
        }).addStyleClass("sapUiSmallMarginBottom"));

        // Search
        const oTable = new sap.m.Table({
            fixedLayout: false,
            columns: [
                new sap.m.Column({ header: new sap.m.Label({ text: "Brand" }) }),
                new sap.m.Column({ header: new sap.m.Label({ text: "Laptop Model" }) }),
                new sap.m.Column({ header: new sap.m.Label({ text: "Battery Capacity" }) })
            ],
            items: {
                path: response.dataPath,
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{laptopModel>Brand}" }),
                        new sap.m.Text({ text: "{laptopModel>Model}" }),
                        new sap.m.Text({ text: "{laptopModel>BatteryCapacity}" })
                    ]
                })
            }
        }).addStyleClass("scrollableTable");

        const oSearch = new sap.m.SearchField({
            placeholder: "Search",
            width: "100%",
            liveChange: function (oEvent) {
                const sQuery = oEvent.getParameter("newValue");
                const oBinding = oTable.getBinding("items");
                oBinding.filter([
                    new sap.ui.model.Filter([
                        new sap.ui.model.Filter("Brand", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false)
                ]);
            }
        });

        oCard.addItem(oSearch);

        // Scroll container for table
        const oScrollContainer = new sap.m.ScrollContainer({
            height: "200px",
            vertical: true,
            horizontal: false,
            content: [oTable]
        });
        oCard.addItem(oScrollContainer);

        const oButtonBar = new sap.m.HBox({
            justifyContent: "End",
            items: [
                new sap.m.Button({
                    text: "Cancel",
                    type: "Transparent",
                    press: function () {
                        oCard.destroy();
                    }
                }),
                new sap.m.Button({
                    text: "OK",
                    type: "Emphasized",
                    press: function () {
                        sap.m.MessageToast.show("Selection Confirmed");
                        oCard.destroy();
                    }
                })
            ]
        }).addStyleClass("sapUiSmallMarginTop");

        oCard.addItem(oButtonBar);
        oVBox.addItem(oCard);
    }

    if (response.type === "card" && response.details) {
        const oCard = new sap.m.VBox({
            width: "100%",
            fitContainer:true,
            items: []
        }).addStyleClass("sapUiSmallMargin cardStyle2");

        // Create two-column detail layout
        const aDetailKeys = Object.keys(response.details);
        for (let i = 0; i < aDetailKeys.length; i += 2) {
            oCard.addItem(new sap.m.HBox({
                justifyContent: "SpaceBetween",
                wrap: sap.m.FlexWrap.Wrap,
                items: [
                    new sap.m.VBox({
                        items: [
                            new sap.m.Label({ text: aDetailKeys[i] + ":" }).addStyleClass("detailLabel"),
                            new sap.m.Text({ text: response.details[aDetailKeys[i]] })
                        ]
                    }).addStyleClass("sapUiSmallMarginEnd"),
                    (aDetailKeys[i + 1] ? new sap.m.VBox({
                        items: [
                            new sap.m.Label({ text: aDetailKeys[i + 1] + ":" }).addStyleClass("detailLabel"),
                            new sap.m.Text({ text: response.details[aDetailKeys[i + 1]] })
                        ]
                    }) : new sap.m.VBox())
                ]
            }).addStyleClass("sapUiSmallMarginBottom "));
        }
        oVBox.addItem(oCard);
        
    }

    oChatContainer.addItem(oVBox);

    // Auto-scroll
    setTimeout(() => {
        const oScrollContainer = this.byId("chatScrollContainer");
        if (oScrollContainer) {
            oScrollContainer.scrollTo(0, 10000, 500);
        }
    }, 100);
}


,
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
    const loweredMsg = message.toLowerCase();
    const oResponses = this.getView().getModel("botModel").getProperty("/responses");

   
    for (let key in oResponses) {
        if (loweredMsg.includes(key.toLowerCase())) {
            if (key === "I want to procure laptop battery") {
                return {
                    type: "table",
                    text: oResponses[key],
                    dataPath: "laptopModel>/laptops"
                };
            }
            
    if (loweredMsg.includes("dell inspiron 15 7000")) {
        return {
            type: "text",
            text: oResponses["Dell Inspiron 15 7000"]
        };
    }

  
    if (loweredMsg.includes("yes,create request")) {
        return {
            type: "card",
            text: oResponses["Yes,Create Request"],
            details: {
                Material: "Laptop Battery",
                Category: "012-Hardware",
                Brand: "Dell",
                "Laptop Model": "Inspiron 15 7000",
                "Battery Capacity": "42 Wh"
            }
        };
    } if(loweredMsg.includes("yes,proceed")){
      return{
        type:"itementry",
        text:oResponses["Yes,Proceed"],
        
      }
    }
    else {
                return { type: "text", text: oResponses[key] };
            }
        }
    }

    return { type: "text", text: oResponses["default"] };
}



    ,
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