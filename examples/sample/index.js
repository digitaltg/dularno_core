const { application, bootstrap, AbstractController } = require("../../");
const { InMemoDatabase } = require("../dummy/database");

const bodyParser = require('body-parser');
const cors = require('cors')


//Controller
class TodoController extends AbstractController {

    /**
     * @type {InMemoDatabase}
     */
    Database = null;

    constructor(deps) {
        super(deps);
    }

    get__list(req, res, next, path = '/tasks') {
        this.Database.insert({ id: 1, name: "task_1" });
        const data = this.Database.get()
        return res.json(data);
    }
}
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
            providers: {
                "TodoController": {
                    class: TodoController,
                    arguments: [],
                    deps: ["Database"]
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





bootstrap(configuration, app);
//app.listen(5555, () => {});

module.exports = app;
