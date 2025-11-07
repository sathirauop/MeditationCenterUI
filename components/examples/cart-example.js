'use client';

import { useCartStore } from '@/lib/stores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

/**
 * Example component showing how to use the cart store
 * Cart data is persisted to localStorage
 */
export default function CartExample() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  // Example items to add to cart
  const exampleItems = [
    { id: 'event-1', name: 'Weekend Meditation Retreat', price: 5000, type: 'event' },
    { id: 'program-1', name: 'Mindfulness Course (6 weeks)', price: 8000, type: 'program' },
    { id: 'donation-1', name: 'General Donation', price: 1000, type: 'donation' },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Shopping Cart Example</h2>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <Badge>{getTotalItems()} items</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Available Items */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Available Items</h3>
          {exampleItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription>LKR {item.price.toLocaleString()}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => addItem(item)} size="sm" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Cart Contents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Your Cart</h3>
            {items.length > 0 && (
              <Button onClick={clearCart} variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {items.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <CardDescription>
                      LKR {item.price.toLocaleString()} each
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          variant="outline"
                          size="sm"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Subtotal: LKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {/* Cart Total */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>LKR {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <Button
                    className="w-full mt-4 bg-white text-primary hover:bg-white/90"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="mt-8 bg-muted">
        <CardHeader>
          <CardTitle>About This Example</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Persistence:</strong> Cart data is automatically saved to localStorage
            and will persist across page refreshes.
          </p>
          <p>
            <strong>Global State:</strong> The cart state is accessible from any component
            in your app using <code className="bg-background px-1 rounded">useCartStore()</code>.
          </p>
          <p>
            <strong>Real-time Updates:</strong> Changes to the cart instantly update all
            components using the cart store.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
