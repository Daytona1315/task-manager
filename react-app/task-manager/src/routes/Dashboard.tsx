import Head from "../components/dashboard/Head";
import Content from "../components/dashboard/Content";
import AddTask from "../components/dashboard/AddTask";

function Dashboard () {
    
    return (
        <>
            <Head />
            <AddTask />
            <Content />
        </>
    );
}

export default Dashboard;