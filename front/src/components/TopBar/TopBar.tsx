import styles from './TopBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const TopBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLoginClick = () => {
    navigate('/Login'); 
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };
    const handleFavoriteClick = () => {
    navigate('/Favorites'); 
  };
      const handleMyCardsClick = () => {
    navigate('/Mycards'); 
  };
      const handleMarketplaceClick = () => {
    navigate('/buysell'); 
  };
      const mainHandleClick = () => {
    navigate('/');
  };
  return (
    <div className={styles["topBar"]}>
      <img className={styles["main_icon"]} src="/lightPokeLogo.png" alt="로고" onClick={mainHandleClick}/>
      
      <div className={styles["topBar-buttons"]}>
        <input 
          type="button" 
          value="관심 카드" 
          onClick={handleFavoriteClick} 
        />
        <input 
          type="button" 
          value="내 카드" 
          onClick={handleMyCardsClick} 
        />
        <input 
          type="button" 
          value="장터" 
          onClick={handleMarketplaceClick} 
        />

        {isLoggedIn ? (
          <input 
            type="button" 
            value="로그아웃" 
            onClick={handleLogoutClick} 
          />
        ) : (
          <input 
            type="button" 
            value="로그인" 
            onClick={handleLoginClick} 
          />
        )}
      </div>
    </div>
  );
}

export default TopBar;
