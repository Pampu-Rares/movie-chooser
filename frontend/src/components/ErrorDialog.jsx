import '../css/errorDialog.css'

function ErrorDialog({message, handleReturn}) {
    return (
        <div id='error-dialog'>
            <h3>An error occured</h3>
            <p>{message}</p>
            <button id='return-button' onClick={handleReturn}>Return</button>
        </div>
    )
}

export default ErrorDialog