import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="MessageSquare" size={28} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">Hey, SMS!</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Главная</a>
              <a href="#numbers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Мои номера</a>
              <a href="#buy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Купить номер</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Тарифы</a>
              <a href="#support" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Поддержка</a>
            </div>

            <Button className="hidden md:flex">Войти</Button>
          </div>
        </div>
      </nav>

      <section id="home" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Прием СМС на виртуальные номера онлайн
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Сервис <span className="font-semibold text-foreground">Hey, SMS!</span> предоставляет персональные виртуальные номера для приема СМС. Каждый номер — только для вас. Все сообщения приходят исключительно вам на выбранный период.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-10 max-w-2xl mx-auto">
              <p className="text-base text-foreground">
                <Icon name="ShieldCheck" size={20} className="inline text-primary mr-2" />
                <span className="font-semibold">Эксклюзивное использование:</span> 1 номер = 1 пользователь. Никаких общих номеров — полная конфиденциальность гарантирована.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Начать работу
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
                <CardTitle className="text-xl">Персональный номер</CardTitle>
                <CardDescription className="text-base">
                  Номер выдается только вам — никто другой не получит доступ к вашим SMS
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Globe" size={24} className="text-primary" />
                </div>
                <CardTitle className="text-xl">Мгновенная активация</CardTitle>
                <CardDescription className="text-base">
                  Получите номер за секунды и сразу начинайте принимать SMS для ваших сервисов
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <CardTitle className="text-xl">100% приватность</CardTitle>
                <CardDescription className="text-base">
                  Все SMS приходят только вам — защита данных и конфиденциальность на высшем уровне
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Простые и честные тарифы</h2>
            <p className="text-xl text-muted-foreground">Выберите подходящий план для ваших задач</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Базовый</CardTitle>
                <CardDescription className="text-base">Для личного использования</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">₽99</span>
                  <span className="text-muted-foreground">/номер</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">1 номер на 24 часа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Неограниченный прием SMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Базовая поддержка</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Выбрать</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg scale-105">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Профессиональный</CardTitle>
                  <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Популярный</span>
                </div>
                <CardDescription className="text-base">Для бизнеса и проектов</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">₽499</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">5 номеров одновременно</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Неограниченный прием SMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">API доступ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Приоритетная поддержка</span>
                  </li>
                </ul>
                <Button className="w-full mt-6">Выбрать</Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl">Корпоративный</CardTitle>
                <CardDescription className="text-base">Для крупных компаний</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">₽2499</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Безлимит номеров</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Неограниченный прием SMS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Полный API доступ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">Персональный менеджер</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={20} className="text-primary mt-0.5" />
                    <span className="text-sm">SLA 99.9%</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Связаться</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="support" className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Icon name="Headphones" size={48} className="text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Остались вопросы?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Наша команда поддержки всегда на связи — помогаем выбрать номер и решаем любые вопросы 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                <Icon name="Mail" size={20} className="mr-2" />
                Написать в поддержку
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Открыть чат
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="MessageSquare" size={24} className="text-primary" />
              <span className="font-bold text-foreground">Hey, SMS!</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Hey, SMS! Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;