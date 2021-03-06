import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import logoImg from '../../img/logo.svg';
import iMenu from '../../img/i_menu.svg';
import Login from '../login';
import Modal from '../modal';
import SignupLibrary from '../signupLibrary';
import SignupUser from '../signupUser';
import { userLogout } from '../../logic/user';

import './Header.scss';

const Header = ({ openSignupLibrary, setOpenSignupLibrary }) => {

	const { idUser, nameUser, isAdmin } = useSelector(state => state.user);
	const { idLibrary, nameLibrary } = useSelector(state => state.library);
	const menuName = idUser ? (isAdmin ? 'admin' : 'user') : 'default';

	const [logoLink, setLogoLink] = useState('/');
	const [modalSignupLibraryIsOpen, setModalSignupLibraryIsOpen] = useState(false);
	const [modalSignupIsOpen, setModalSignupIsOpen] = useState(false);
	const [modalLoginIsOpen, setModalLoginIsOpen] = useState(false);
	const [formSuccess, setFormSuccess] = useState('');

	const history = useHistory();

	const handleLogout = () => {
		history.push(`/`);
		userLogout();
	};

	const handleOpenMenu = (show) => {
		const nav = document.getElementById('headerNav');
		if(show) {
			nav.classList.toggle('hide_m');
		} else {
			nav.classList.add('hide_m');
		}
	}

	useEffect(() => {
		if(openSignupLibrary) {
			setModalSignupLibraryIsOpen(true);
			setOpenSignupLibrary();
		}
	}, [openSignupLibrary]);

	const menus = {
		default: [
			{
				title: 'Crear biblioteca',
				action: setModalSignupLibraryIsOpen,
				actionType: 'function'
			},
			{
				title: 'Regístrate',
				action: setModalSignupIsOpen,
				actionType: 'function'
			},
			{
				title: 'Iniciar sesión',
				action: setModalLoginIsOpen,
				actionType: 'function'
			}
		],
		user: [
			{
				title: 'Inicio',
				action: `/${idLibrary}/`,
				actionType: 'url'
			},
			{
				title: 'Mis libros',
				action: `/${idLibrary}/mis-libros/`,
				actionType: 'url'
			},
			// {
			// 	title: 'Mi perfil',
			// 	action: '',
			// 	actionType: 'function'
			// },
			{
				title: 'Salir',
				action: handleLogout,
				actionType: 'function'
			}
		],
		admin: [
			// {
			// 	title: 'Dashboard',
			// 	action: `/${idLibrary}/admin/`,
			// 	actionType: 'url'
			// },
			{
				title: 'Colección',
				action: `/${idLibrary}/admin/`,
				actionType: 'url'
			},
			// {
			// 	title: 'Configuración',
			// 	action: '',
			// 	actionType: 'function'
			// },
			{
				title: 'Salir',
				action: handleLogout,
				actionType: 'function'
			}
		]
	};

	function getMenu(menuName) {
		const menuItems = menus[menuName];
		return (
			menuItems.map(({ title, action, actionType }, i) => {
				if(actionType === 'function'){
					return (<button key={i} onClick={() => action(true)} className="header_nav_item">{title}</button>);
				} else {
					return (<Link key={i} to={action} className="header_nav_item">{title}</Link>);
				}
			})
		);
	}

	useEffect(() => {
		if(formSuccess === 'admin'){
			history.push(`/${idLibrary}/admin/`);
			setFormSuccess('');
		} else if(formSuccess === 'user'){
			history.push(`/${idLibrary}/`);
			setFormSuccess('');
		} else if(formSuccess === 'login') {
			if(isAdmin) {
				history.push(`/${idLibrary}/admin/`);
			} else {
				history.push(`/${idLibrary}/`);
			}
			setFormSuccess('');
		}
		if(isAdmin !== undefined) {
			if(isAdmin) {
				setLogoLink(`/${idLibrary}/admin/`);
			} else {
				setLogoLink(`/${idLibrary}/`);
			}
		} else {
			setLogoLink(`/`);
		}
	}, [history, formSuccess, idLibrary, isAdmin]);

	return (
		<>
			<header className="header">
				<div className="container">
					<Link to={logoLink} className="header_logo">
						<img src={logoImg} alt="" />
						<span>Book<span>Lend</span></span>
					</Link>
					{nameLibrary && <span className="header_library">/ {nameLibrary}</span>}
					{nameUser && <button className="header_user">¡Hola <strong>{nameUser}</strong>!</button>}
					{/* {nameUser}</strong>! <span className="header_user_icon">›</span></button>} */}
					<button onClick={() => handleOpenMenu(true)} className="header_nav_m"><img src={iMenu} alt="Menú" /></button>
					<nav id="headerNav" className="header_nav hide_m" onClick={() => handleOpenMenu(false)}>
						{getMenu(menuName)}
					</nav>
				</div>
			</header>
			<Modal
				title="Crear una biblioteca"
				isOpen={modalSignupLibraryIsOpen}
				onClose={() => setModalSignupLibraryIsOpen(false)}
			>
				<SignupLibrary
					isModalClosed={modalSignupLibraryIsOpen}
					onCancel={() => setModalSignupLibraryIsOpen(false)}
					onSuccess={() => setFormSuccess('admin')}
				/>
			</Modal>
			<Modal
				title="Regístrate"
				isOpen={modalSignupIsOpen}
				onClose={() => setModalSignupIsOpen(false)}
			>
				<SignupUser
					isModalClosed={modalSignupIsOpen}
					onCancel={() => setModalSignupIsOpen(false)}
					onSuccess={() => setFormSuccess('user')}
				/>
			</Modal>
			<Modal
				title="Iniciar sesión"
				isOpen={modalLoginIsOpen}
				onClose={() => setModalLoginIsOpen(false)}
			>
				<Login
					isModalClosed={modalLoginIsOpen}
					onCancel={() => setModalLoginIsOpen(false)}
					onSuccess={() => setFormSuccess('login')}
				/>
			</Modal>
		</>
	);

};

export default Header;