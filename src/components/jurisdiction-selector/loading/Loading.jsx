import './Loading.css';

const Loading = ({loadingKey}) => {

    return (
        <div id={'loading'} key={loadingKey} className="loader"></div> 
    );
};

export default Loading;

