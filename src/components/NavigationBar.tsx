import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const NavigationBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => navigate('/')}>
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};
