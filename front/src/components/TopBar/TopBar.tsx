import styles from './TopBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const TopBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { loginId } = useAuth();

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };
  const handleMyPageClick = () => {
    navigate('/mypage')
  }
  const handleChatClick = () => {
    navigate(`/Chat/${loginId}`);
  };
  const handleFavoriteClick = () => {
    navigate('/Favorites');
  };
  const handleMyCardsClick = () => {
    navigate('/Mycards');
  };
  const handleMyDealsClick = () => {
    navigate('/Mydeals');
  };
  const handleMarketplaceClick = () => {
    navigate('/buysell');
  };
  const mainHandleClick = () => {
    navigate('/');
  };
  return (
    <div className={styles["topBar"]}>
      <img className={styles["main_icon"]} src="/lightPokeLogo.png" alt="로고" onClick={mainHandleClick} />

      <div className={styles["topBar-buttons"]}>
        <input
          type="button"
          value="대화 목록"
          onClick={handleChatClick}
        />
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
          value="내 거래"
          onClick={handleMyDealsClick}
        />
        <input
          type="button"
          value="장터"
          onClick={handleMarketplaceClick}
        />

        {isLoggedIn ? (
          <>
            <input
              type="button"
              value="로그아웃"
              onClick={handleLogoutClick}
            />
            <input
              type="button"
              value="내 페이지"
              onClick={handleMyPageClick}
            />
          </>
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
