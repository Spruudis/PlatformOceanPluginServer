const BasePlugIn = require("../../Plugin APIs/plug-in_base");
const config = require('./config');

class UserRoleManagement extends BasePlugIn{
    'use strict';
    #databaseID = 'UserRoleManagement';
    #database
    #collection_availableRoles
    #collection_users

    //TODO: argument check on every command
    //TODO: Convert to hooks for the Citizen's assembly plug-in
    //TODO: Get all users hook


    constructor(parentObject) {
        super(parentObject);
        console.log("--UserRoleManagement---Running constructor---")


        this.registerHook("getUserRole", args => {
            return new Promise((resolve, reject) => {
                const userName = args[0];
                if(userName === undefined){
                    resolve(null);
                    return;
                }

                this.#collection_users.findOne({username: userName})
                    .then(result => {
                        let hasPermission = false;
                        const promises = []

                        if (result.roles === undefined) {
                            resolve(null);
                            return;
                        }
                        resolve(result.roles)
                    })
            })
        })

        //Checks a user has a specific Permission, depending on what roles they occupy. Resolves to true or false;
        this.registerHook("checkUserPermission", args => {
            return new Promise((resolve, reject) => {

                const userName = args[0];
                const permissionName = args[1];

                console.log(
                    "UserRoleManagement: ",
                    "attempting to check if user ",
                    args[0],
                    " has the permission -  ",
                    args[1]);

                this.#collection_users.findOne({username: userName})
                    .then(result => {
                        let hasPermission = false;
                        const promises = []

                        if(result.roles === undefined){
                            resolve(false);
                            return;
                        }

                        result.roles.forEach(role =>{
                            promises.push(new Promise((resolve, reject) => {
                                    this.#collection_availableRoles.findOne({role: role})
                                        .then(innerResult => {
                                            if(Object.keys(innerResult).includes('permissions')){
                                                if(innerResult.permissions.includes(permissionName)){
                                                    hasPermission = true;
                                                }
                                            }
                                            resolve();
                                        }, reason => reject(reason))})
                            )
                        })

                        Promise.all(promises)
                            .then((results) => {
                                resolve(hasPermission);
                            }, (reasons) => {
                                reject(reasons)
                            })
                    }, reason => reject(reason))
            })
        })

        //Adds a role to an already existing user. Rejects promise if the user is not registered to URM.
        this.registerHook("registerUserRole", args => {
            return new Promise((resolve, reject) => {
                let userName = args[0];
                let roleName = args[1];

                console.log(
                    "UserRoleManagement: ",
                    "attempting to associate user ",
                    args[0],
                    " with the role of ",
                    args[1]);

                if(roleName !== undefined && userName !== undefined){
                    //check if it is a valid role
                    this.#collection_availableRoles.find({ role: roleName })
                        .toArray((err, result) => {
                            if(err) reject(err);

                            if(result.length>0){
                                this.#addRoleToUser(userName, roleName, (err, res) => {
                                        if (err) reject(err);

                                        //TODO: Pretty up log, remove debug message
                                        console.log("UserRoleManagement:",
                                            "updated the role for ", res.result.n, " user(s)");
                                        this.#collection_users.find().toArray().then((result) => {
                                            console.log("Users present: ", result);
                                        });

                                        resolve();
                                    }
                                )
                            } else {
                                reject("User Role Management does not recognise the role " + roleName);
                            }
                        });
                }
            })
        })


        this.registerHook("registerUser", args=>{
            return new Promise((resolve, reject) => {
                console.log(
                    "UserRoleManagement: ",
                    "attempting add a new user with username: ",
                    args[0]);

                this.#addUser(args[0])
                    .then(result => {
                        resolve(result.matchedCount)
                    })
                    .catch(reason => reject(reason));
            })
        })


        this.registerHook("removeAllPermissions", args=>{
            return new Promise((resolve, reject) => {
                this.#removeAllPermissions().then(result => resolve(result));
            })
        })


        this.registerHook('registerRolePermission', args => {

            return new Promise((resolve, reject) => {
                console.log(
                    "UserRoleManagement: ",
                    "attempting to add the permission",
                    args[1],
                    " to the role of ",
                    args[0]);

                let permissionName = args[1];
                let roleName = args[0];

                if(roleName !== undefined && permissionName !== undefined){
                    this.#addPermissionToRole(roleName, permissionName, (err, res) => {
                            if (err) reject(err);
                            console.log(
                                "UserRoleManagement:",
                                "updated the role with ",
                                res.result.n,
                                " permission(s)");
                            resolve()
                        }
                    )
                } else {
                    console.log("UserRoleManagement: ",
                        "attempting to add the permission",
                        args[1],
                        " to the role of ",
                        args[0], " ---  Not enough arguments provided")
                    reject("Not enough arguments provided")
                }
            })
        })

        //Adds a role to be available for association with users
        this.registerHook('registerRole', args => {
            return new Promise((resolve, reject) => {
                console.log(
                    "UserRoleManagement: ",
                    "attempting to add a new available role: ",
                    args[0]);

                this.#addAvailableRole(args[0])
                    .then(result => {
                        console.log("UserRoleManagement: ", result.result.n, " role(s) inserted");
                        resolve(args)
                    }, reason => reject(reason))
            })
        })







        this.subscribeToEvent('URM_addUser', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting add a new user with username: ",
                eventProxyResponder.eventMessage[0]);
            this.#addUser(eventProxyResponder.eventMessage[0])
                .then(result => {
                    console.log("UserRoleManagement: ", result.matchedCount, " existing user(s) found matching username: ", eventProxyResponder.eventMessage[0]);
                    this.#collection_users.find().toArray().then((result) => {
                        console.log("Users present: ", result);
                    });
                })
                .catch(reason => console.error(reason));
        })

        this.subscribeToEvent('URM_deleteUser', (eventProxyResponder) => {
            console.log("UserRoleManagement: ", "attempting to delete users matching username: ", eventProxyResponder.eventMessage[0]);
            this.#deleteUser(eventProxyResponder.eventMessage[0], (err, res) => {
                if (err) throw err;
                console.log("UserRoleManagement: ", res.deletedCount, " user(s) deleted matching username: ", eventProxyResponder.eventMessage[0]);
                this.#collection_users.find().toArray().then((result) => {
                    console.log("Users present: ", result);
                });
            })

        })


        //Adds a role to be available for association with users
        this.subscribeToEvent('URM_addAvailableRole', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting to add a new available role: ",
                eventProxyResponder.eventMessage[0]);

            this.#addAvailableRole(eventProxyResponder.eventMessage[0])
                .then(result => {
                    console.log("UserRoleManagement: ", result.result.n, " role(s) inserted");
                    this.#collection_availableRoles.find().toArray().then((result) => {
                        console.log("Available roles: ", result);
                    });

                }, reason => console.error(reason))
                .catch(reason => console.error(reason))
        })

        this.subscribeToEvent('URM_removeAvailableRole', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting to remove an available role: ",
                eventProxyResponder.eventMessage[0]);

            this.#deleteAvailableRole(eventProxyResponder.eventMessage[0]);

        })


        //Allows the association of a roles (i.e., roles: ['Expert', 'Participant']) field to each user document
        this.subscribeToEvent('URM_registerUserRole', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting to associate user ",
                eventProxyResponder.eventMessage[0],
                " with the role of ",
                eventProxyResponder.eventMessage[1]);

            let userName = eventProxyResponder.eventMessage[0];
            let roleName = eventProxyResponder.eventMessage[1];

            if(roleName !== undefined && userName !== undefined){
                //check if it is a valid role
                this.#collection_availableRoles.find({ role: roleName })
                    .toArray((err, result) => {
                    if(result.length>0){
                        this.#addRoleToUser(userName, roleName, (err, res) => {
                                if (err) throw err;
                                console.log("UserRoleManagement:",
                                    "updated the role for ", res.result.n, " user(s)");
                                this.#collection_users.find().toArray().then((result) => {
                                    console.log("Users present: ", result);
                                });
                            }
                        )
                    } else {
                        eventProxyResponder.respondToSender('debug message', "The role " + roleName + "is not available")
                    }
                });
            }
        })

        this.subscribeToEvent('URM_removeUserRole', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting to disassociate user ",
                eventProxyResponder.eventMessage[0],
                " from the role of ",
                eventProxyResponder.eventMessage[1]);

            let userName = eventProxyResponder.eventMessage[0];
            let roleName = eventProxyResponder.eventMessage[1];

            if(roleName !== undefined && userName !== undefined){
                this.#removeRoleFromUser(userName, roleName, (err, res) => {
                        if (err) throw err;
                        console.log("UserRoleManagement:",
                            "updated the role for ", res.result.n, " user(s)");
                        this.#collection_users.find().toArray().then((result) => {
                            console.log("Users present: ", result);
                        });
                    }
                )
            } else {
                eventProxyResponder.respondToSender('debug message', "Not enough arguments provided")
            }
        })



        this.subscribeToEvent('URM_associateRolePermission', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting to add the permission",
                eventProxyResponder.eventMessage[1],
                " to the role of ",
                eventProxyResponder.eventMessage[0]);
            let permissionName = eventProxyResponder.eventMessage[1];
            let roleName = eventProxyResponder.eventMessage[0];

            if(roleName !== undefined && permissionName !== undefined){
                this.#addPermissionToRole(roleName, permissionName, (err, res) => {
                        if (err) throw err;
                        console.log(
                            "UserRoleManagement:",
                            "updated the role with ",
                            res.result.n,
                            " permission(s)");
                        this.#collection_availableRoles.find().toArray().then((result) => {
                            console.log("Roles present: ", result);
                        });
                    }
                )
            } else {
                eventProxyResponder.respondToSender('debug message', "Not enough arguments provided")
            }
        })

        this.subscribeToEvent('URM_disassociateRolePermission', (eventProxyResponder) => {
            console.log(
                "UserRoleManagement: ",
                "attempting to remove the permission",
                eventProxyResponder.eventMessage[1],
                " from the role ",
                eventProxyResponder.eventMessage[0]);

            let permissionName = eventProxyResponder.eventMessage[1];
            let roleName = eventProxyResponder.eventMessage[0];

            if(roleName !== undefined && permissionName !== undefined){
                this.#removePermissionFromRole(roleName, permissionName, (err, res) => {
                        if (err) throw err;
                        console.log(
                            "UserRoleManagement:",
                            "updated the role with ",
                            res.result.n,
                            " permission(s)");
                        this.#collection_availableRoles.find().toArray().then((result) => {
                            console.log("Roles present: ", result);
                        });
                    }
                )
            } else {
                eventProxyResponder.respondToSender('debug message', "Not enough arguments provided")
            }
        })


    }

    setup(){
        return new Promise((resolve, reject) => {
            console.log("---Setting up UserRoleManagement")

            let databaseResult = this.databaseProxy.databaseClient(this.#databaseID);
            if(databaseResult.databaseFound){
                //Setup collections(if not already present)
                this.#database = this.databaseProxy.databaseClient(this.#databaseID).client;

                this.#collection_availableRoles = this.#database.collection('availableRoles');
                this.#collection_availableRoles.createIndex( { "role": 1 }, { unique: true } );

                this.#collection_users = this.#database.collection('users');
                this.#collection_users.createIndex( { "username": 1 }, { unique: true } );

                const setupPromises = [];

                //remove all socket information
                setupPromises.push(this.#collection_users.updateMany({}, {$unset:{socketID: ""}}));


                const availableRoles = [];
                config.roles.forEach(item => {
                    availableRoles.push(item.role);
                })

                console.log("---Setting up UserRoleManagement - available roles:", availableRoles);

                //If overwrite roles, delete non-specified ones
                if(config.overwriteExistingRoles){
                    setupPromises.push(this.#collection_availableRoles.deleteMany({role:{ $nin:availableRoles}}));
                    setupPromises.push(
                        this.#collection_users.updateMany(
                        { },
                        { $pull: { roles: {$nin: availableRoles} } },
                        )
                    )
                }

                if(config.overwriteExistingPermissions){
                    setupPromises.push(new Promise((resolve, reject) => {
                        const permissionPromises = [];

                        this.#collection_availableRoles.updateMany(
                            {},
                            {$unset:{permissions: ""}},
                            {}
                        ).then(
                            //Add all the specified roles
                            config.roles.forEach(element => {
                                if(element.permissions){
                                    permissionPromises.push(this.#collection_availableRoles.updateMany(
                                        {role: element.role},
                                        { $addToSet: { permissions: { $each: element.permissions} }},
                                        {"upsert": true},
                                    ))
                                }
                            })
                        )

                        Promise.all(permissionPromises).then(result => {
                            resolve(result);
                        }, error => {
                            reject(error);
                        })
                    }))
                }else{
                    //Add all the specified roles
                    config.roles.forEach(element => {
                        if(element.permissions){
                            setupPromises.push(this.#collection_availableRoles.updateMany(
                                {role: element.role},
                                { $addToSet: { permissions: { $each: element.permissions} }},
                                {"upsert": true},
                            ))
                        }
                    })
                }

                Promise.all(setupPromises).then(result => {
                    console.log("---Setting up UserRoleManagement - Finished setup");
                    resolve(result);
                }, error => {
                    console.log("---Setting up UserRoleManagement - Error in setup");
                    reject(error);
                })


            }
        })
    }

    start(){
        return new Promise((resolve, reject) => {
            console.log("----Starting UserRoleManagement");
            resolve();
        })

    }


    //-------------------------Database interaction functionality--------------------------
    //------------------------------------------------------------------
    //---------- Add and remove roles available to Users ----------------
    #addAvailableRole(roleName){
        return this.#collection_availableRoles.updateOne(
            {role: roleName},
            {$set:{role: roleName}},
            {"upsert": true},
        )
    }

    #deleteAvailableRole(roleName){
        //Remove role from available roles list
        this.#collection_availableRoles.deleteMany({role: roleName },{}, (err, obj) => {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
        });

        //Remove all user association with the role
        this.#collection_users.updateMany(
            { },
            { $pull: { roles: roleName} },
            { multi: true },
            (err, res) => {
                if (err) throw err;
                console.log(
                    "UserRoleManagement:",
                    "updated the role for ",
                    res.result.n,
                    " user(s)");
                this.#collection_users.find().toArray().then((result) => {
                    console.log("Users present: ", result);
                });
            })
    }

    //------------------------------------------------------------------
    //--------------Add and remove permissions to roles -------------
    #addPermissionToRole(roleName, permissionName, callback){
        return this.#collection_availableRoles.updateMany(
            {role: roleName},
            { $addToSet: { permissions: permissionName } },
            {},
            callback)
    }

    #removePermissionFromRole(roleName, permissionName, callback){
        return this.#collection_availableRoles.updateMany(
            {role: roleName},
            { $pull: { permissions: permissionName} },
            { multi: true },
            callback)
    }

    #removeAllPermissions(){
        return this.#collection_availableRoles.updateMany(
            {},
            { $unset: { permissions: ""} },
            { multi: true })
    }


    //------------------------------------------------------------------
    //-----------Add and remove Users from the user list --------------
    #addUser(userName){
        return this.#collection_users.updateOne(
            {username: userName},
            {$set:{username: userName}},
            {"upsert": true},
        )
    }

    #deleteUser(userName, callback){
        return this.#collection_users.deleteMany(
            {username: userName},
            {},
            callback);
    }

    //------------------------------------------------------------------
    //----------------Add and remove Roles to users --------------------
    #addRoleToUser(userName, roleName, callback){
        return this.#collection_users.updateMany(
            {username: userName},
            { $addToSet: { roles: roleName } },
            {},
            callback
        )
    }

    #removeRoleFromUser(userName, roleName, callback){
        this.#collection_users.updateMany(
            {username: userName},
            { $pull: { roles: roleName} },
            { multi: true },
            callback)
    }


    get userCollectionAccess(){
        return this.#collection_users;
    }

}

module.exports = UserRoleManagement;