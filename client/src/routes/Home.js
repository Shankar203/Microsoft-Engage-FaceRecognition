import { useOutletContext } from "react-router-dom";

const Home = () => {
    const user = useOutletContext()
    console.log(user.user.name);
    return ( 
        <div>
            Home
        </div>
     );
}
 
export default Home;