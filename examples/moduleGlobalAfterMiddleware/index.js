const { application, bootstrap, AbstractController } = require("../../");
const { InMemoDatabase } = require("../dummy/database");

const bodyParser = require('body-parser');
const cors = require('cors');
const { TodoController } = require("./controller");
const { AfterMiddleware } = require("./aMiddleware");

//DUlarno services
const configuration = {
    providers: {
        Database: {
            class: InMemoDatabase,
            arguments: [],
            deps: []
        }
    },
    modules: [
        {
            name: "TodoModule",
            controllers: [
                "TodoController"
            ],
            middlewares: [
                {
                    action: "after", path: "/after", 
                    clazzs: ["AfterMiddleware"],
                }
            ],
            providers: {
                "TodoController": {
                    class: TodoController,
                    arguments: [],
                    deps: ["Database"]
                },
                "AfterMiddleware": {
                    class: AfterMiddleware,
                    arguments: {},
                    deps: [],
                }
            }

        }
    ]
}

const app = application();
app.use(application.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "*" //TODO: use envars
}));





const boot = bootstrap(configuration, app);
module.exports = { app, boot };
