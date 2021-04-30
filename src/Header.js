import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { auth, storage, db } from './firebase.js';

function Header(props) {

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(() => {

    }, []);

    function openModalCreateAccount(e) {
        e.preventDefault();
        let modal = document.querySelector('.modalCreateAccount');
        modal.style.display = 'block';
    }

    function closeModalCreateAccount() {
        let modal = document.querySelector('.modalCreateAccount');
        let form = document.getElementById('createAccount-form').reset();
        modal.style.display = 'none';
    }

    function createAccount(e) {
        e.preventDefault();
        let email = document.getElementById('email-create').value;
        let username = document.getElementById('username-create').value;
        let pass = document.getElementById('password-create').value;
        //creating a account firebase
        auth.createUserWithEmailAndPassword(email, pass)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: username
                })
                alert('Conta criada com sucesso');
                closeModalCreateAccount();
            }).catch((error) => {
                alert(error.message);
            });
    }

    function login(e) {
        e.preventDefault();
        let email = document.getElementById('email-login').value;
        let pass = document.getElementById('password-login').value;

        auth.signInWithEmailAndPassword(email, pass)
            .then((auth) => {
                props.setUser(auth.user.displayName);
                window.location.href = '/';
            }).catch((error) => {
                alert(error.message);
            });
    }

    function openModalUpload(e) {
        e.preventDefault();
        let modal = document.querySelector('.modalUpload');
        modal.style.display = 'block';
    }

    function closeModalUpload() {
        let modal = document.querySelector('.modalUpload');
        modal.style.display = 'none';
        document.getElementById('upload-form').reset();
    }

    function uploadPost(e) {
        e.preventDefault();
        let titlePost = document.getElementById('title-upload').value;

        const uploadTask = storage.ref(`images/${file.name}`).put(file);
        uploadTask.on('state_changed', function (snapshot) {
            const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, function (error) {
            
        }, function () {
            storage.ref('images').child(file.name).getDownloadURL()
            .then(function(url) {
                db.collection('posts').add({
                    title: titlePost,
                    image: url,
                    userName: props.user,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                setProgress(0);
                setFile(null);
                alert('Upload realizado com sucesso!');
                closeModalUpload();
            });
        });
    }

    function logout(e) {
        e.preventDefault();
        auth.signOut().then(function (val) {
           props.setUser(null); 
           window.location.href = '/';
        });
    }

    return (
        <div className="header" >
            <div className="modalCreateAccount">
                <div className="formCreateAccount">
                    <div onClick={() => closeModalCreateAccount()} className="closeModalCreateAccount">X</div>
                    <h2>Criar Conta</h2>
                    <form id='createAccount-form' onSubmit={(e) => createAccount(e)}>
                        <input id='email-create' type="text" placeholder="Digite seu e-mail" />
                        <input id='username-create' type="text" placeholder="Digite seu nome de usuário" />
                        <input id='password-create' type="password" placeholder="Digite sua senha" />
                        <input type="submit" name="action" value="Criar conta" />
                    </form>
                </div>
            </div>
            <div className="modalUpload">
                <div className="formUpload">
                    <div onClick={() => closeModalUpload()} className="closeModalUpload">X</div>
                    <h2>Fazer Upload</h2>
                    <form id='upload-form' onSubmit={(e) => uploadPost(e)}>
                        <progress id='progress-upload' value={progress}></progress>
                        <input id='title-upload' type="text" placeholder="Título do post" />
                        <input onChange={(e) => setFile(e.target.files[0])} type='file' name='file' />
                        <input type="submit" name="action" value="Upload" />
                    </form>
                </div>
            </div>
            <div className="center">
                <div className="header_logo">
                    <a href="#"><img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" /></a>
                </div>
                {
                    (props.user) ?
                        <div className="header_loginInfo">
                            <spam>Olá <b>{props.user}</b></spam>
                            <a onClick={(e) => openModalUpload(e)} href="#">Postar</a>
                            <a onClick={(e)=>logout(e)}>Logout</a>
                        </div>
                        :
                        <div className="header_loginForm">
                            <form onSubmit={(e) => login(e)}>
                                <input id='email-login' type="text" placeholder="Login" />
                                <input id='password-login' type="password" placeholder="Senha" />
                                <input type="submit" name="action" value="Logar" />
                            </form>
                            <div onClick={(e) => openModalCreateAccount(e)} className="btn_CreateAccount">
                                <a href="">Criar conta</a>
                            </div>
                        </div>
                }
            </div>
        </div >
    )
}

export default Header;