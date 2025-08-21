
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/Text",
  "sap/f/Card",
  "sap/f/library",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], (Controller, Fragment, Text, Card, fLibrary, JSONModel, MessageToast, Filter, FilterOperator) => {
  "use strict";

  return Controller.extend("com.intakedashboard.controller.dashboard", {
    onInit() {
      var oModel = new JSONModel({
        suggestions: [
          { text: "New General Ledger Account Creation", key: "GL" },
          { text: "Business Partner Onboarding", key: "BP" },
          { text: "Non-Catalogue Item Requisition", key: "NC" }
        ],
        worklist: [{
          requestId: "REQ00097",
          title: "PR for Medical Gloves",
          date: "21 July 2025",
          status: "Draft"
        },
        {
          requestId: "REQ00096",
          title: "PR for Laptop Battery and Mouse",
          date: "21 July 2025",
          status: "In Progress"
        },
        {
          requestId: "REQ00092",
          title: "Request for 24” Monitors",
          date: "08 May 2025",
          status: "Completed"
        }
        ]
      });
      this.getView().setModel(oModel);
      const oBotModel = new sap.ui.model.json.JSONModel();
      oBotModel.loadData("model/botData.json");
      this.getView().setModel(oBotModel, "botModel");

      const oLaptopModel = new sap.ui.model.json.JSONModel();
      oLaptopModel.loadData("model/laptopData.json");
      this.getView().setModel(oLaptopModel, "laptopModel");
    },
    onAfterRendering: function () {
      const mCardLinks = {
        glCard: "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/d27faf66-3cbf-4eb4-a0a0-d5f38a9bbb5d.glcreateaccount.cominturecwglaccountcreation-0.0.1/index.html",
        bpCard: "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/cwbponboarding.comincturecoecwbponboarding-0.0.1/index.html",
        ncCard: "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/25768153-2c7f-47ea-9eee-7eb25d976698.non-catalogueItemRequisition.noncatalogueitemrequisition-0.0.1/index.html"
      };

      Object.entries(mCardLinks).forEach(([sId, sUrl]) => {
        const oCard = this.byId(sId);
        if (oCard && !oCard._clickAttached) {
          oCard.addStyleClass("clickableCard");
          oCard.attachBrowserEvent("click", () => window.open(sUrl, "_blank"));
          oCard._clickAttached = true;
        }
      });

      var oTable = this.byId("worklistTable"); // ID of your table
      if (oTable) {
        oTable.getItems().forEach(oItem => {
          var oContext = oItem.getBindingContext();
          if (oContext) {
            var sStatus = oContext.getProperty("status");
            var oObjectStatus = oItem.getCells()[3]; // index of your ObjectStatus cell

            oObjectStatus.removeStyleClass("statusCompleted")
              .removeStyleClass("statusInProgress")
              .removeStyleClass("statusDefault");

            if (sStatus === "Completed") {
              oObjectStatus.addStyleClass("statusCompleted");
            } else if (sStatus === "In Progress") {
              oObjectStatus.addStyleClass("statusInProgress");
            } else {
              oObjectStatus.addStyleClass("statusDefault");
            }
          }
        });
      }
    },

    onNewRequestPress: function () {
      // Show the ComboBox when button is clicked
      this.byId("requestSearch").setVisible(true);
    },

    onRequestSelect: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("selectedItem");
      var sSelectedText = "";

      // Check if user selected from dropdown or typed manually
      if (oSelectedItem) {
        sSelectedText = oSelectedItem.getText();
      } else {
        // fallback: get typed value
        sSelectedText = oEvent.getSource().getValue();
      }

      var mUrlMap = {
        "New General Ledger Account Creation":
          "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/d27faf66-3cbf-4eb4-a0a0-d5f38a9bbb5d.glcreateaccount.cominturecwglaccountcreation-0.0.1/index.html",
        "Business Partner Onboarding":
          "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/cwbponboarding.comincturecoecwbponboarding-0.0.1/index.html",
        "Non-Catalogue Item Requisition":
          "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/25768153-2c7f-47ea-9eee-7eb25d976698.non-catalogueItemRequisition.noncatalogueitemrequisition-0.0.1/index.html"
      };

      if (mUrlMap[sSelectedText]) {
        window.open(mUrlMap[sSelectedText], "_blank");
      } else {
        sap.m.MessageToast.show("Please select a valid option from the list.");
      }
    },
    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("query");

      var mUrlMap = {
        "New General Ledger Account Creation":
          "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/d27faf66-3cbf-4eb4-a0a0-d5f38a9bbb5d.glcreateaccount.cominturecwglaccountcreation-0.0.1/index.html",
        "Business Partner Onboarding":
          "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/cwbponboarding.comincturecoecwbponboarding-0.0.1/index.html",
        "Non-Catalogue Item Requisition":
          "https://incbtpcoe.launchpad.cfapps.us10.hana.ondemand.com/25768153-2c7f-47ea-9eee-7eb25d976698.non-catalogueItemRequisition.noncatalogueitemrequisition-0.0.1/index.html"
      };

      if (mUrlMap[sQuery]) {
        window.open(mUrlMap[sQuery], "_blank");
      } else {
        MessageToast.show("No matching request found.");
      }
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
      const oCompactGreeting = oView.byId("chatContainer");

      if (oGreetingSection && oCompactGreeting) {
        oGreetingSection.setVisible(true);
        oCompactGreeting.setVisible(false);
      } else {
        console.warn("Greeting elements not found.");
      }
    },

    onSendMessage: function (oEvent) {
      const sMessage = oEvent.getParameter("value");
      if (!sMessage) return;

      const oView = this.getView();
      const oGreetingSection = oView.byId("greetingSection");
      const oCompactGreeting = oView.byId("chatContainer");

      if (oGreetingSection && oGreetingSection.getVisible()) {
        oGreetingSection.setVisible(false);
        oCompactGreeting.setVisible(true);
      }

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
        }).addStyleClass("sapUiSmallMarginTop cardStyle");

        // Title
        oCard.addItem(new sap.m.Label({
          text: "Select Laptop Battery Model",
          design: "Bold"
        }).addStyleClass("sapUiSmallMarginBottom"));

        // Search
        const oTable = new sap.m.Table({
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

      if (response.type === "materialitementry") {
        const oCard = new sap.m.VBox({
          width: "90%",
          height: "50%",
          items: []
        }).addStyleClass("sapUiSmallMarginTop cardStyle");

        const aFields = [
          {
            label: "Quantity:",
            control: new sap.m.Input({
              value: "1",
              type: "Number",
              width: "150px"
            })
          },
          {
            label: "UOM:",
            control: new sap.m.Input({
              showValueHelp: true,
              value: "EA-Each",
              valueHelpRequest: function () {
                sap.m.MessageToast.show("Open UOM Value Help");
              },
              width: "150px"
            })
          },
          {
            label: "Estimated Unit Price:",
            control: new sap.m.Input({
              value: "0.00",
              type: "Number",
              width: "150px"
            })
          },
          {
            label: "Currency:",
            control: new sap.m.Input({
              showValueHelp: true,
              value: "USD",
              valueHelpRequest: function () {
                sap.m.MessageToast.show("Open Currency Value Help");
              },
              width: "150px"
            })
          }
        ];

        for (let i = 0; i < aFields.length; i += 2) {
          oCard.addItem(new sap.m.HBox({
            justifyContent: "SpaceBetween",
            items: [
              new sap.m.VBox({
                items: [
                  new sap.m.Label({ text: aFields[i].label }),
                  aFields[i].control
                ]
              }),
              new sap.m.VBox({
                items: [
                  new sap.m.Label({ text: aFields[i + 1].label }),
                  aFields[i + 1].control
                ]
              })
            ]
          }).addStyleClass("sapUiSmallMarginBottom"));
        }

        // Footer bar inside the card
        const oFooterBar = new sap.m.Toolbar({
          content: [
            new sap.m.ToolbarSpacer(),
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
                const sQuantity = parseFloat(aFields[0].control.getValue()) || 0;
                const sUOM = aFields[1].control.getValue();
                const sPrice = parseFloat(aFields[2].control.getValue()) || 0;
                const sCurrency = aFields[3].control.getValue();

                const sTotal = (sQuantity * sPrice).toFixed(2);

                oCard.destroy();

                const oUserCard = new sap.m.VBox({
                  width: "90%",
                  items: []
                }).addStyleClass("sapUiSmallMargin whiteCard");

                const aPairs = [
                  { label: "Quantity:", value: sQuantity },
                  { label: "UOM:", value: sUOM },
                  { label: "Estimated Unit Price:", value: sPrice },
                  { label: "Currency:", value: sCurrency },
                  { label: "Total", value: sTotal }
                ];

                for (let i = 0; i < aPairs.length; i += 2) {
                  oUserCard.addItem(new sap.m.HBox({
                    justifyContent: "SpaceBetween",
                    wrap: sap.m.FlexWrap.Wrap,
                    items: [
                      new sap.m.VBox({
                        items: [
                          new sap.m.Label({ text: aPairs[i].label }).addStyleClass("detailLabel"),
                          new sap.m.Text({ text: aPairs[i].value })
                        ]
                      }).addStyleClass("sapUiSmallMarginEnd"),
                      (aPairs[i + 1] ? new sap.m.VBox({
                        items: [
                          new sap.m.Label({ text: aPairs[i + 1].label }).addStyleClass("detailLabel"),
                          new sap.m.Text({ text: aPairs[i + 1].value })
                        ]
                      }) : new sap.m.VBox())
                    ]
                  }).addStyleClass("sapUiSmallMarginBottom"));
                }

                const oUserBubble = new sap.m.HBox({
                  justifyContent: "End",
                  width: "100%",
                  items: [
                    new sap.m.VBox({
                      items: [oUserCard]
                    }).addStyleClass("purpleBubble")
                  ]
                }).addStyleClass("outerBubble");

                oVBox.addItem(oUserBubble);
                const sBotFollowUp = "Got it.Would you like to add more item specifications?";
                oVBox.addItem(new sap.m.VBox({
                  justifyContent: "Start",
                  items: [
                    new sap.m.VBox({
                      items: [new sap.m.Text({ text: sBotFollowUp })]
                    }).addStyleClass("sapUiSmallMarginTop botMessage"),
                    new sap.m.HBox({
                      justifyContent: "Start",
                      items: [
                        new sap.m.Button({
                          text: "Add Item Specifications",
                          type: "Default",
                          press: function () {
                            const oCard = new sap.m.VBox({
                              width: "90%",
                              items: []
                            }).addStyleClass("sapUiSmallMarginTop cardStyle");

                            // Fields for specifications
                            const aFields = [
                              {
                                label: "Type:",
                                control: new sap.m.Input({
                                  value: "Wireless",
                                  showValueHelp: true,
                                  valueHelpRequest: function () {
                                    sap.m.MessageToast.show("Open Type Value Help");
                                  },
                                  width: "150px"
                                })
                              },
                              {
                                label: "Brand:",
                                control: new sap.m.Input({
                                  value: "Lenovo",
                                  showValueHelp: true,
                                  valueHelpRequest: function () {
                                    sap.m.MessageToast.show("Open Brand Value Help");
                                  },
                                  width: "150px"
                                })
                              }
                            ];

                            // Arrange fields in rows (2 per row)
                            for (let i = 0; i < aFields.length; i += 2) {
                              oCard.addItem(new sap.m.HBox({
                                justifyContent: "SpaceBetween",
                                items: [
                                  new sap.m.VBox({
                                    items: [
                                      new sap.m.Label({ text: aFields[i].label }),
                                      aFields[i].control
                                    ]
                                  }),
                                  new sap.m.VBox({
                                    items: [
                                      new sap.m.Label({ text: aFields[i + 1].label }),
                                      aFields[i + 1].control
                                    ]
                                  })
                                ]
                              }).addStyleClass("sapUiSmallMarginBottom"));
                            }

                            // Footer bar inside the card
                            const oFooterBar = new sap.m.Toolbar({
                              content: [
                                new sap.m.ToolbarSpacer(),
                                new sap.m.Button({
                                  text: "Skip",
                                  type: "Transparent",
                                  press: function () {
                                    oCard.destroy();
                                  }
                                }),
                                new sap.m.Button({
                                  text: "OK",
                                  type: "Emphasized",
                                  press: function () {
                                    const sType = aFields[0].control.getValue();
                                    const sBrand = aFields[1].control.getValue();

                                    oCard.destroy();

                                    // User bubble card
                                    const oUserCard = new sap.m.VBox({
                                      width: "90%",
                                      items: []
                                    }).addStyleClass("sapUiSmallMargin whiteCard");

                                    const aPairs = [
                                      { label: "Type:", value: sType },
                                      { label: "Brand:", value: sBrand }
                                    ];

                                    let oHeaderRow = new sap.m.HBox({
                                      items: aPairs.map(pair =>
                                        new sap.m.Label({
                                          text: pair.label
                                        }).addStyleClass("detailLabel").setWidth("100%")
                                      ),
                                      justifyContent: "SpaceBetween"
                                    });

                                    let oValueRow = new sap.m.HBox({
                                      items: aPairs.map(pair =>
                                        new sap.m.Text({
                                          text: pair.value
                                        }).addStyleClass("detailValue").setWidth("100%")
                                      ),
                                      justifyContent: "SpaceBetween"
                                    });

                                    oUserCard.addItem(
                                      new sap.m.VBox({
                                        items: [oHeaderRow, oValueRow]
                                      }).addStyleClass("sapUiSmallMarginBottom")
                                    );


                                    const oUserBubble = new sap.m.HBox({
                                      justifyContent: "End",
                                      width: "100%",
                                      items: [
                                        new sap.m.VBox({
                                          items: [oUserCard]
                                        }).addStyleClass("purpleBubble")
                                      ]
                                    }).addStyleClass("outerBubble");

                                    oVBox.addItem(oUserBubble);

                                    const sBotFollowUp = "Item 2 has been successfully added to your request# REQ000096. What would you like to do rest?";
                                    oVBox.addItem(new sap.m.VBox({
                                      justifyContent: "Start",
                                      items: [
                                        new sap.m.VBox({
                                          items: [new sap.m.Text({ text: sBotFollowUp })]
                                        }).addStyleClass("sapUiSmallMarginTop botMessage"),
                                        new sap.m.HBox({
                                          justifyContent: "Start",
                                          items: [
                                            new sap.m.Button({
                                              text: "Add Another Item",
                                              type: "Default",
                                              press: function () {
                                              }
                                            }).addStyleClass("sapUiTinyMarginTop"),
                                            new sap.m.Button({
                                              text: "Review and Submit",
                                              type: "Default",
                                              press: function () {
                                                const oUserBubble = new sap.m.HBox({
                                                  justifyContent: "End",
                                                  width: "100%",
                                                  items: [
                                                    new sap.m.VBox({
                                                      items: [
                                                        new sap.m.Text({
                                                          text: "Review and Submit"
                                                        }).addStyleClass("detailValue")
                                                      ]
                                                    }).addStyleClass("purpleBubble")
                                                  ]
                                                }).addStyleClass("outerBubble");

                                                oVBox.addItem(oUserBubble);
                                              }
                                            }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")
                                          ]
                                        })
                                      ]
                                    }));

                                  }
                                })
                              ]
                            }).addStyleClass("sapUiSmallMarginTop");

                            oCard.addItem(oFooterBar);
                            oVBox.addItem(oCard);
                          }
                        }).addStyleClass("sapUiTinyMarginTop"),
                        new sap.m.Button({
                          text: "Skip",
                          type: "Default",
                          press: function () {

                          }
                        }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")
                      ]
                    })
                  ]
                }));

              }

            })
          ]
        }).addStyleClass("sapUiSmallMarginTop");

        oCard.addItem(oFooterBar);

        oVBox.addItem(oCard);
      }
      if (response.type === "createRequest") {
        console.log("create req");

        const oButtonRow = new sap.m.HBox({
          items: [
            new sap.m.Button({
              text: "Yes, Create Request",
              type: "Default",
              press: function () {
                const oUserBubble = new sap.m.HBox({
                  justifyContent: "End", // right side
                  width: "100%",
                  items: [
                    new sap.m.VBox({
                      items: [
                        new sap.m.Text({ text: "Yes, Create Request" })
                          .addStyleClass("userMessage")
                      ]
                    }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginEnd")
                  ]
                });
                const cardResponse = {
                  type: "card",
                  details: {
                    "Material": "Laptop Battery",
                    "Category": "012-Hardware",
                    "Brand": "Dell",
                    "Laptop Model": "Inspiron 15 7000",
                    "Battery Capacity": "42 Wh"
                  }
                };

                const oCard = new sap.m.VBox({
                  width: "100%",
                  fitContainer: true,
                  items: []
                }).addStyleClass("cardStyle2 ");

                const aDetailKeys = Object.keys(cardResponse.details);
                for (let i = 0; i < aDetailKeys.length; i += 2) {
                  oCard.addItem(new sap.m.HBox({
                    justifyContent: "Start",
                    wrap: sap.m.FlexWrap.Wrap,
                    items: [
                      new sap.m.VBox({
                        items: [
                          new sap.m.Label({ text: aDetailKeys[i] + ":" }).addStyleClass("detailLabel"),
                          new sap.m.Text({ text: cardResponse.details[aDetailKeys[i]] })
                        ]
                      }).addStyleClass("sapUiSmallMarginEnd")
                        .setLayoutData(new sap.m.FlexItemData({ growFactor: 1 })),

                      (aDetailKeys[i + 1] ? new sap.m.VBox({
                        items: [
                          new sap.m.Label({ text: aDetailKeys[i + 1] + ":" }).addStyleClass("detailLabel"),
                          new sap.m.Text({ text: cardResponse.details[aDetailKeys[i + 1]] })
                        ]
                      }).setLayoutData(new sap.m.FlexItemData({ growFactor: 1 }))
                        : new sap.m.VBox())
                    ]
                  }).addStyleClass("sapUiSmallMarginBottom "));
                }

                const oOuterCard = new sap.m.VBox({
                  width: "100%",
                  items: [
                    new sap.m.Text({
                      text: "I found a similar item listed in Ariba library. Would you like to proceed with this item?"
                    }).addStyleClass("sapUiSmallMarginBottom"),
                    oCard
                  ]
                }).addStyleClass("botMessage");
                oVBox.addItem(oUserBubble);

                oVBox.addItem(oOuterCard);

                const oActionButtons = new sap.m.HBox({
                  justifyContent: "Start",
                  items: [
                    new sap.m.Button({
                      text: "Yes, Proceed",
                      type: "Default",
                      press: function () {

                        const oUserBubble = new sap.m.HBox({
                          justifyContent: "End",
                          width: "100%",
                          items: [
                            new sap.m.VBox({
                              items: [
                                new sap.m.Text({ text: "Yes, Proceed" })
                                  .addStyleClass("userMessage")
                              ]
                            }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginEnd")
                          ]
                        });

                        const oCard = new sap.m.VBox({
                          width: "90%",
                          height: "50%",
                          items: []
                        }).addStyleClass("sapUiSmallMargin cardStyle");

                        const aFields = [
                          {
                            label: "Quantity:",
                            control: new sap.m.Input({
                              value: "1",
                              type: "Number",
                              width: "150px"
                            })
                          },
                          {
                            label: "UOM:",
                            control: new sap.m.Input({
                              showValueHelp: true,
                              value: "EA-Each",
                              valueHelpRequest: function () {
                                sap.m.MessageToast.show("Open UOM Value Help");
                              },
                              width: "150px"
                            })
                          },
                          {
                            label: "Estimated Unit Price:",
                            control: new sap.m.Input({
                              value: "0.00",
                              type: "Number",
                              width: "150px"
                            })
                          },
                          {
                            label: "Currency:",
                            control: new sap.m.Input({
                              showValueHelp: true,
                              value: "USD",
                              valueHelpRequest: function () {
                                sap.m.MessageToast.show("Open Currency Value Help");
                              },
                              width: "150px"
                            })
                          }
                        ];

                        for (let i = 0; i < aFields.length; i += 2) {
                          oCard.addItem(new sap.m.HBox({
                            justifyContent: "SpaceBetween",
                            items: [
                              new sap.m.VBox({
                                items: [
                                  new sap.m.Label({ text: aFields[i].label }),
                                  aFields[i].control
                                ]
                              }),
                              new sap.m.VBox({
                                items: [
                                  new sap.m.Label({ text: aFields[i + 1].label }),
                                  aFields[i + 1].control
                                ]
                              })
                            ]
                          }).addStyleClass("sapUiSmallMarginBottom"));
                        }

                        // Footer bar inside the card
                        const oFooterBar = new sap.m.Toolbar({
                          content: [
                            new sap.m.ToolbarSpacer(),
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
                                const sQuantity = parseFloat(aFields[0].control.getValue()) || 0;
                                const sUOM = aFields[1].control.getValue();
                                const sPrice = parseFloat(aFields[2].control.getValue()) || 0;
                                const sCurrency = aFields[3].control.getValue();

                                const sTotal = (sQuantity * sPrice).toFixed(2);

                                oCard.destroy();

                                const oUserCard = new sap.m.VBox({
                                  width: "90%",
                                  items: []
                                }).addStyleClass("sapUiSmallMargin whiteCard");

                                const aPairs = [
                                  { label: "Quantity:", value: sQuantity },
                                  { label: "UOM:", value: sUOM },
                                  { label: "Estimated Unit Price:", value: sPrice },
                                  { label: "Currency:", value: sCurrency },
                                  { label: "Total", value: sTotal }
                                ];

                                for (let i = 0; i < aPairs.length; i += 2) {
                                  oUserCard.addItem(new sap.m.HBox({
                                    justifyContent: "SpaceBetween",
                                    wrap: sap.m.FlexWrap.Wrap,
                                    items: [
                                      new sap.m.VBox({
                                        items: [
                                          new sap.m.Label({ text: aPairs[i].label }).addStyleClass("detailLabel"),
                                          new sap.m.Text({ text: aPairs[i].value })
                                        ]
                                      }).addStyleClass("sapUiSmallMarginEnd"),
                                      (aPairs[i + 1] ? new sap.m.VBox({
                                        items: [
                                          new sap.m.Label({ text: aPairs[i + 1].label }).addStyleClass("detailLabel"),
                                          new sap.m.Text({ text: aPairs[i + 1].value })
                                        ]
                                      }) : new sap.m.VBox())
                                    ]
                                  }).addStyleClass("sapUiSmallMarginBottom"));
                                }

                                const oUserBubble = new sap.m.HBox({
                                  justifyContent: "End",
                                  width: "100%",
                                  items: [
                                    new sap.m.VBox({
                                      items: [oUserCard]
                                    }).addStyleClass("purpleBubble")
                                  ]
                                }).addStyleClass("outerBubble");

                                oVBox.addItem(oUserBubble);
                                const sBotFollowUp = "Item has been successfully added to your request #REQ000096. What would you like to do next?";
                                oVBox.addItem(new sap.m.VBox({
                                  justifyContent: "Start",
                                  items: [
                                    new sap.m.VBox({
                                      items: [new sap.m.Text({ text: sBotFollowUp })]
                                    }).addStyleClass("sapUiSmallMarginTop botMessage"),
                                    new sap.m.HBox({
                                      justifyContent: "Start",
                                      items: [
                                        new sap.m.Button({
                                          text: "Add Another Item",
                                          type: "Default",
                                          press: function () {
                                            const oCard = new sap.m.VBox({
                                              width: "100%",
                                              items: []
                                            }).addStyleClass("sapUiSmallMarginTop cardStyle");


                                            oCard.addItem(new sap.m.Label({
                                              text: "Select Material",
                                              design: "Bold"
                                            }).addStyleClass("sapUiSmallMarginBottom"));

                                            const oTable = new sap.m.Table({
                                              fixedLayout: false,
                                              columns: [
                                                new sap.m.Column({ header: new sap.m.Label({ text: "Material ID" }) }),
                                                new sap.m.Column({ header: new sap.m.Label({ text: "Product" }) }),
                                              ],
                                              items: {
                                                path: "botModel>/materials",
                                                template: new sap.m.ColumnListItem({
                                                  type: "Active", // 👈 makes row clickable
                                                  cells: [
                                                    new sap.m.Text({ text: "{botModel>MaterialID}" }),
                                                    new sap.m.Text({ text: "{botModel>Product}" }),
                                                  ],
                                                  press: function (oEvent) {
                                                    const oCtx = oEvent.getSource().getBindingContext("botModel");
                                                    const sMaterialID = oCtx.getProperty("MaterialID");
                                                    const sProduct = oCtx.getProperty("Product");

                                                    const oUserBubble = new sap.m.HBox({
                                                      justifyContent: "End",
                                                      width: "100%",
                                                      items: [
                                                        new sap.m.VBox({
                                                          items: [
                                                            new sap.m.Text({
                                                              text: `${sProduct}`
                                                            }).addStyleClass("userMessage")
                                                          ]
                                                        }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginEnd")
                                                      ]
                                                    });

                                                    oVBox.addItem(oUserBubble);

                                                    const oBotResponse = new sap.m.VBox({
                                                      width: "100%",
                                                      items: [
                                                        new sap.m.Text({
                                                          text: `You selected *${sProduct}* (Material ID: ${sMaterialID}). Please confirm quantity and details.`
                                                        }).addStyleClass("botMessage sapUiSmallMarginTop")
                                                      ]
                                                    });

                                                    oVBox.addItem(oBotResponse);
                                                  }
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
                                                    new sap.ui.model.Filter("MaterialID", sap.ui.model.FilterOperator.Contains, sQuery),
                                                    new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.Contains, sQuery)
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
                                                    oCard.destroy();


                                                  }
                                                })
                                              ]
                                            }).addStyleClass("sapUiSmallMarginTop");

                                            oCard.addItem(oButtonBar);
                                            oVBox.addItem(oCard);
                                          }
                                        }).addStyleClass("sapUiTinyMarginTop"),
                                        new sap.m.Button({
                                          text: "Review and Submit",
                                          type: "Default",
                                          press: function () {

                                          }
                                        }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")
                                      ]
                                    })
                                  ]
                                }));

                              }

                            })
                          ]
                        }).addStyleClass("sapUiSmallMarginTop");

                        oCard.addItem(oFooterBar);
                        oVBox.addItem(oUserBubble);

                        oVBox.addItem(oCard);
                      }
                    }).addStyleClass("sapUiTinyMarginEnd"),

                    new sap.m.Button({
                      text: "No, Create Different Item",
                      type: "Default",
                      press: function () {
                        MessageToast.show("Request submitted successfully!");
                      }
                    })
                  ]
                }).addStyleClass("sapUiTinyMarginTop");

                oVBox.addItem(oActionButtons);

                oButtonRow.setVisible(false);
              }
            }).addStyleClass("sapUiTinyMarginEnd"),

            new sap.m.Button({
              text: "No, Cancel",
              type: "Default",
              press: function () {
                MessageToast.show("Request cancelled");
                oButtonRow.setVisible(false);
              }
            })
          ]
        });

        const oUserBubble = new sap.m.HBox({
          justifyContent: "Start",
          width: "100%",
          items: [
            new sap.m.VBox({
              items: [oButtonRow]
            }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin")
          ]
        });

        oVBox.addItem(oUserBubble);
      }


      oChatContainer.addItem(oVBox);

      // Auto-scroll
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
      const loweredMsg = message.toLowerCase();
      const oResponses = this.getView().getModel("botModel").getProperty("/responses");

      if (loweredMsg.includes("yes,proceed")) {
        return {
          type: "itementry",
          text: oResponses["Yes,Proceed"]
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
      }

      if (loweredMsg.includes("add another item")) {
        return {
          type: "materialTable",
          text: oResponses["Add Another Item"],
          dataPath: "botModel>/materials"
        };
      }

      if (loweredMsg.includes("computer mouse")) {
        return {
          type: "materialitementry",
          text: oResponses["Computer Mouse"]
        };
      }

      if (loweredMsg.includes("add item specifications")) {
        return {
          type: "specifications",
          text: oResponses["Add Item Specifications"]
        };
      }

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
              type: "createRequest",
              text: oResponses["Dell Inspiron 15 7000"]
            };
          }

          return { type: "text", text: oResponses[key] };
        }
      }

      return { type: "text", text: oResponses["default"] };
    },



    _scrollToBottom: function () {
      const oScrollContainer = this.byId("chatScrollContainer");
      if (oScrollContainer) {
        setTimeout(() => {
          oScrollContainer.scrollTo(0, 10000, 500); 
        }, 100);
      }
    },
    onCloseChatFragment: function () {
      const oChatContainer = this.byId("chatContainer");
      const oInput = this.byId("userInput");

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