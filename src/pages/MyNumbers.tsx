import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface SMSMessage {
  id: number;
  from_number: string;
  message_body: string;
  received_at: string;
}

interface NumberData {
  phone_number: string;
  country_code: string;
  expires_at: string;
  messages: SMSMessage[];
}

const MyNumbers = () => {
  const [data, setData] = useState<NumberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const promocode = localStorage.getItem('promocode');
    
    if (!promocode) {
      navigate('/activate');
      return;
    }

    loadNumberData(promocode);
    const interval = setInterval(() => loadNumberData(promocode), 10000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const loadNumberData = async (code: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/923c9e1d-6ee5-49bb-973f-a26c74275f83?code=${code}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Ошибка загрузки данных');
        setLoading(false);
        return;
      }

      setData(result);
      setError('');
      setLoading(false);
    } catch (err) {
      setError('Ошибка соединения');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('promocode');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Icon name="Loader2" size={48} className="text-primary animate-spin" />
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
              <span className="text-2xl font-bold text-foreground">Hey, SMS!</span>
            </a>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Мой номер</h1>
              <p className="text-lg text-muted-foreground">
                Все входящие SMS будут отображаться здесь в реальном времени
              </p>
            </div>

            {error && (
              <Card className="border-destructive bg-destructive/5 mb-6">
                <CardContent className="pt-6">
                  <p className="text-destructive flex items-center gap-2">
                    <Icon name="AlertCircle" size={20} />
                    {error}
                  </p>
                </CardContent>
              </Card>
            )}

            {data && (
              <>
                <Card className="border-2 border-primary mb-8">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Icon name="Phone" size={24} className="text-primary" />
                      Ваш виртуальный номер
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Номер телефона</p>
                        <p className="text-3xl font-bold text-foreground">{data.phone_number}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Страна</p>
                          <p className="text-lg font-medium">{data.country_code}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Действует до</p>
                          <p className="text-lg font-medium">{formatDate(data.expires_at)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">
                    Входящие SMS ({data.messages.length})
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => loadNumberData(localStorage.getItem('promocode')!)}>
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Обновить
                  </Button>
                </div>

                {data.messages.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">
                        Пока нет сообщений. SMS будут появляться здесь автоматически.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {data.messages.map((msg) => (
                      <Card key={msg.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Icon name="Mail" size={20} className="text-primary" />
                              <CardTitle className="text-lg">{msg.from_number}</CardTitle>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(msg.received_at)}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground whitespace-pre-wrap">{msg.message_body}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyNumbers;