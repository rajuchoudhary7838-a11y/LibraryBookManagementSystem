import { useState } from 'react';
import { Book } from '../lib/mockData';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, Calendar, Clock, RotateCcw, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export type BookRequestStatus = 'none' | 'pending' | 'approved' | 'returned' | 'declined';

interface BookCardProps {
  book: Book;
  onView: (book: Book) => void;
  onRequest?: (book: Book) => void;
  onReturn?: (book: Book) => void;
  userRequestStatus?: BookRequestStatus;
  showActions?: boolean;
}

export default function BookCard({
  book,
  onView,
  onRequest,
  onReturn,
  userRequestStatus = 'none',
  showActions = true,
}: BookCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAvailable = book.availableQuantity > 0;

  const renderRequestButton = () => {
    if (!onRequest && !onReturn) return null;

    switch (userRequestStatus) {
      case 'pending':
        return (
          <Button size="sm" className="flex-1 bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed opacity-80" disabled>
            <Clock className="w-3 h-3 mr-1" />
            Requested
          </Button>
        );
      case 'approved':
        return (
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onReturn?.(book)}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Return
          </Button>
        );
      case 'returned':
        return (
          <Button size="sm" variant="outline" className="flex-1 cursor-not-allowed opacity-60" disabled>
            <CheckCircle className="w-3 h-3 mr-1" />
            Returned
          </Button>
        );
      case 'declined':
      case 'none':
      default:
        return (
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled={!isAvailable}
            onClick={() => onRequest?.(book)}
          >
            Request
          </Button>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
              )}
              <img
                src={book.image}
                alt={book.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <BookOpen className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={isAvailable ? 'default' : 'destructive'} className="shadow-md">
              {isAvailable ? `${book.availableQuantity} Available` : 'Not Available'}
            </Badge>
          </div>
          {userRequestStatus === 'approved' && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-green-600 text-white shadow-md text-xs">Issued</Badge>
            </div>
          )}
          {userRequestStatus === 'pending' && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500 text-white shadow-md text-xs">Pending</Badge>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4 space-y-2">
          <div>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(book.publishedDate).getFullYear()}</span>
          </div>

          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
        </CardContent>

        {showActions && (
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView(book)}
            >
              View Details
            </Button>
            {renderRequestButton()}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
