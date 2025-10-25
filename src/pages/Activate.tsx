import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const Activate = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleActivate = async () => {
    if (!code.trim()) {
      setError('Введите промокод');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://functions.poehali.dev/40e39b9f-a5c9-4112-807b-79e4cb1736e0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка активации промокода');
        setLoading(false);
        return;
      }

      localStorage.setItem('promocode', code.trim());
      navigate('/my-numbers');
    } catch (err) {
      setError('Ошибка соединения с сервером');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Icon name="MessageSquare" size={28} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">Hey, SMS!</span>
            </a>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </nav>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Key" size={32} className="text-primary" />
                </div>
                <CardTitle className="text-3xl">Активация номера</CardTitle>
                <CardDescription className="text-base">
                  Введите промокод для получения доступа к виртуальному номеру
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Промокод</label>
                  <Input
                    type="text"
                    placeholder="Введите ваш промокод"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleActivate()}
                    className="text-lg h-12"
                    disabled={loading}
                  />
                  {error && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <Icon name="AlertCircle" size={16} />
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleActivate}
                  disabled={loading || !code.trim()}
                  className="w-full h-12 text-lg"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Активация...
                    </>
                  ) : (
                    <>
                      Активировать
                      <Icon name="ArrowRight" size={20} className="ml-2" />
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Нет промокода? Свяжитесь с нами для получения доступа
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activate;