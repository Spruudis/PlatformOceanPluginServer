const TreeModel = require('tree-model')
const fs = require('fs');
const Path = require("path");


const PlatformOceanServer = require("./server");
const BasePlugIn = require("./Plugin APIs/plug-in_base");
const UserRoleManagement = require("./plugins/UserRoleManagement/source");
const MongoDB = require("./plugins/MongoDB/source");


async function startServer(){

    // Init order:
    // 1) Gather plugin structure and settings
    // 2) Initialise plugins in top-down order constructor
    // 3) Register databases
    // 4) start() - everything else with hook, event and database access enabled
    //      *Bottom up order - less important plugins started first to ensure full functionality
    // 5) Connect server to network
    //
    // TODO: All lifecycle methods of plugin modules that are called from the core are contained
    //       in try-catch blocks.

    function initialisePlugins(path, parent){
        //Check if plugin folder exists
        const pluginFolderPath = Path.join(path, "plugins");
        if(fs.existsSync(pluginFolderPath)){
            //For each file/directory in the plugin folder
            fs.readdirSync(pluginFolderPath).forEach(fileName => {
                //check if it is a directory
                if (fs.lstatSync(Path.resolve(pluginFolderPath, fileName)).isDirectory()) {
                    console.log('Plug-in Directory: ' + fileName);
                    let individualPluginFolderPath = Path.join(pluginFolderPath, fileName);
                    let pluginSource = Path.join(individualPluginFolderPath, "source.js")
                    //try loading the plugin
                    if(fs.existsSync(pluginSource)){
                        const Plugin = require("./" + pluginSource);
                        //TODO: provide config input
                        const plugin = new Plugin(parent);
                        initialisePlugins(individualPluginFolderPath, plugin);
                        parent.plugins.push(plugin);
                    }
                }
            });
        }
    }


    //1 - Declare plugins in top-down order in a tree structure
    const paServer = new PlatformOceanServer(3000, "192.168.1.144");
    initialisePlugins(".", paServer);

    //Create plugin tree structure
    const pluginTree = new TreeModel({childrenPropertyName: "plugins"});
    const root = pluginTree.parse(paServer);

    //Gather database initialisation functions
    const initialiseDatabaseFunctions = []
    console.log(root.children.forEach(plugin => {
        plugin.walk(plg => {
            initialiseDatabaseFunctions.push(plg.model.initialiseDatabase())
        })
    }));

    //Gather all plugins in reverse order
    const allPlugins = [];
    root.walk({strategy: 'post'}, function(node){
        allPlugins.push(node.model);
    });

    //2 - Finish Initialising all databases in parallel, then continue with setup
    Promise.all(initialiseDatabaseFunctions)
        .then(() => {
            //4 - Setup plugins
            if(allPlugins.length === 0) return Promise.resolve(true);

            //execute setup() of each plugin (and server core) sequentially
            return allPlugins.reduce((previousPromise, nextPlg) => {
                return previousPromise.then(() => {
                    return nextPlg.setup();
                });
            }, Promise.resolve());

        }, reason => {console.error(reason)})
        .then(() => {
            //4 - Start plugins
            if(allPlugins.length === 0) return Promise.resolve(true);

            //execute start() of each plugin (and server core) sequentially
            return allPlugins.reduce((previousPromise, nextPlg) => {
                return previousPromise.then(() => {
                    return nextPlg.start();
                });
            }, Promise.resolve());

        }, reason => {console.error(reason)})
        .then(() => {
            //5 - Connect to Network
            paServer.registerEventsToNetworkLayer();
            paServer._setupServer();
        })
}


startServer();