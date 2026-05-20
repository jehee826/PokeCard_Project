import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import MainPage from "./components/MainPage";
import Login from './components/Login/Login';
import SignUp from './components/Login/SignUp,PwReset/SignUp';
import PwReset from './components/Login/SignUp,PwReset/PwReset';
import Favorites from './components/Favorites/Favorites';
import MyCards from './components/MyCards/MyCards';
import BuySellList from './components/BuySell/BuySellList';
import BuySellerList from './components/BuySell/BuySellerList';
import BuySellDetail from './components/BuySell/BuySellDetail';
import Payment from './components/BuySell/Payment';
import TopBar from './components/TopBar/TopBar'
import SellRegistration from './components/BuySell/SellRegistration';
import SellEdit from './components/BuySell/SellEdit';
import ProtectedRoute from './components/ProtectedRoute';
import AiCamera from './components/AiCamera/AiCamera';
import MyDeals from './components/MyDeals/MyDeals';
import StompComponent from './components/stomp/StompComponent';



const App = () => {   
  return (
    <div>
      <BrowserRouter>
       <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />        
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/pwreset" element={<PwReset />} />
          <Route path="/buysell" element={<><TopBar/><BuySellList/></>}/>
          <Route path="/AiCamera" element={<><TopBar/><AiCamera/></>}/>
          <Route 
             path="/Chat/:opponentId" 
             element={
               <ProtectedRoute>
                <TopBar/>
                 <StompComponent />
               </ProtectedRoute>
             } 
           />

           <Route 
             path="/favorites" 
             element={
               <ProtectedRoute>
                <TopBar/>
                 <Favorites />
               </ProtectedRoute>
             } 
           />                      
           <Route 
             path="/mycards" 
             element={
               <ProtectedRoute>
                <TopBar/>
                 <MyCards />
               </ProtectedRoute>
             } 
           />
            <Route 
             path="/mydeals" 
             element={
               <ProtectedRoute>
                <TopBar/>
                 <MyDeals />
               </ProtectedRoute>
             } 
           />


           <Route 
             path="/buysell/detail/:id" 
             element={
               <ProtectedRoute>
                 <BuySellDetail />
                </ProtectedRoute>
             } 
           />
           <Route 
             path="/buysell/seller/:id" 
             element={
                <>
                 <TopBar/>
                 <BuySellerList />
                </>
             } 
           />
           <Route 
             path="/buysell/payment/:id" 
             element={
               <ProtectedRoute>
                 <Payment />
               </ProtectedRoute>
             } 
           />
           <Route 
             path="/buysell/sell" 
             element={
               <ProtectedRoute>
                 <SellRegistration />
               </ProtectedRoute>
             } 
           />
           <Route 
             path="/buysell/edit/:id" 
             element={
               <ProtectedRoute>
                 <SellEdit />
               </ProtectedRoute>
             } 
           />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
   
    </div>
  );
};

export default App;
