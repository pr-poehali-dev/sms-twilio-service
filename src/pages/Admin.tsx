import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [expiryDays, setExpiryDays] = useState('7');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  const handleGenerate = async () => {
    if (!phoneNumber.trim()) {
      setError('Введите номер телефона');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/f26acee4-4b83-4533-8b86-e413af311259', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          country_code: countryCode,
          expiry_days: parseInt(expiryDays)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка генерации промокода');
        setLoading(false);
        return;
      }

      setGeneratedCode(data.code);
      setPhoneNumber('');
      setLoading(false);
    } catch (err) {
      setError('Ошибка соединения с сервером');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md border-2">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-3xl">Админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="h-12"
            />
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <Icon name="AlertCircle" size={16} />
                {error}
              </p>
            )}
            <Button onClick={handleLogin} className="w-full h-12">
              Войти
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              На главную
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Icon name="MessageSquare" size={28} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">Hey, SMS! Admin</span>
            </a>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Генерация промокодов</h1>
              <p className="text-lg text-muted-foreground">
                Создайте новый промокод для предоставления доступа к номеру
              </p>
            </div>

            <Card className="border-2 mb-8">
              <CardHeader>
                <CardTitle>Новый промокод</CardTitle>
                <CardDescription>Укажите параметры виртуального номера</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Номер телефона</label>
                  <Input
                    type="text"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Код страны</label>
                    <Input
                      type="text"
                      placeholder="US"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Дней действия</label>
                    <Input
                      type="number"
                      placeholder="7"
                      value={expiryDays}
                      onChange={(e) => setExpiryDays(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Icon name="AlertCircle" size={16} />
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full h-12"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Icon name="Plus" size={20} className="mr-2" />
                      Сгенерировать промокод
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {generatedCode && (
              <Card className="border-2 border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Icon name="CheckCircle" size={24} />
                    Промокод успешно создан!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-lg p-6 border-2 border-primary">
                    <p className="text-sm text-muted-foreground mb-2">Промокод для активации</p>
                    <p className="text-4xl font-bold text-foreground text-center tracking-wider">
                      {generatedCode}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Скопируйте этот код и отправьте пользователю
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;