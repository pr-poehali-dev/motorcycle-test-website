import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/3947a49f-96fe-4469-b171-494ec11f9afa';
const ORDERS_URL = 'https://functions.poehali.dev/14c391f3-2004-4d80-93dd-b22e99377b74';
const FRIENDS_URL = 'https://functions.poehali.dev/aff85453-582b-4bc5-99f4-a8b428e9542b';

type ProfileProps = {
  user: any;
  onUpdate: (user: any) => void;
  onLogout: () => void;
};

export function Profile({ user, onUpdate, onLogout }: ProfileProps) {
  const [displayName, setDisplayName] = useState(user.display_name || user.displayName || '');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchFriends();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);
    }
  }, [selectedFriend]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${ORDERS_URL}?userId=${user.id}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${FRIENDS_URL}?action=friends&userId=${user.id}`);
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Ошибка загрузки друзей:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${AUTH_URL}?action=users&userId=${user.id}`);
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const fetchMessages = async (friendId: number) => {
    try {
      const response = await fetch(`${FRIENDS_URL}?action=messages&userId=${user.id}&friendId=${friendId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}?action=update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, displayName })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        onUpdate(data);
        alert('Профиль обновлён!');
      }
    } catch (error) {
      alert('Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: number) => {
    try {
      const response = await fetch(`${FRIENDS_URL}?action=add-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, friendId })
      });

      if (response.ok) {
        fetchFriends();
        alert('Друг добавлен!');
      }
    } catch (error) {
      alert('Ошибка добавления друга');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const response = await fetch(`${FRIENDS_URL}?action=send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedFriend.id,
          message: newMessage
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedFriend.id);
      }
    } catch (error) {
      alert('Ошибка отправки сообщения');
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      !friends.some((f) => f.id === u.id) &&
      (u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.display_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-glow">Личный кабинет</h1>
          <Button variant="outline" onClick={onLogout}>
            <Icon name="LogOut" className="mr-2" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="orders">История заказов</TabsTrigger>
            <TabsTrigger value="friends">Друзья</TabsTrigger>
            <TabsTrigger value="messages">Сообщения</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-glow-sm">Настройки профиля</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Имя пользователя</Label>
                  <Input value={user.username} disabled className="mt-2" />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="displayName">Отображаемое имя</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-glow-sm">История заказов ({orders.length})</h3>
              {orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">У вас пока нет заказов</p>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{order.movie_title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Заказ #{order.id} от {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <Badge variant="secondary">{order.total_price} ₽</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Места:</strong>{' '}
                        {JSON.parse(order.seats)
                          .map((s: any) => `Ряд ${s.row}, место ${s.number}`)
                          .join('; ')}
                      </p>
                      {order.session_date && (
                        <p>
                          <strong>Дата сеанса:</strong>{' '}
                          {new Date(order.session_date).toLocaleString('ru-RU')}
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="friends">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-glow-sm">Мои друзья ({friends.length})</h3>
                {friends.length === 0 ? (
                  <p className="text-muted-foreground text-sm">У вас пока нет друзей</p>
                ) : (
                  <div className="space-y-3">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex justify-between items-center p-3 bg-accent rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{friend.display_name}</p>
                          <p className="text-sm text-muted-foreground">@{friend.username}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFriend(friend)}
                        >
                          <Icon name="MessageCircle" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-glow-sm">Добавить друзей</h3>
                <Input
                  placeholder="Поиск пользователей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="flex justify-between items-center p-3 bg-accent rounded-lg">
                      <div>
                        <p className="font-semibold">{u.display_name}</p>
                        <p className="text-sm text-muted-foreground">@{u.username}</p>
                      </div>
                      <Button size="sm" onClick={() => handleAddFriend(u.id)}>
                        <Icon name="UserPlus" size={16} className="mr-1" />
                        Добавить
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            {!selectedFriend ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Выберите друга из списка для начала общения</p>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold">{selectedFriend.display_name}</h3>
                    <p className="text-sm text-muted-foreground">@{selectedFriend.username}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedFriend(null)}>
                    <Icon name="X" size={16} />
                  </Button>
                </div>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          msg.sender_id === user.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent'
                        }`}
                      >
                        <p className="text-sm">{msg.message_text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Написать сообщение..."
                    className="resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
