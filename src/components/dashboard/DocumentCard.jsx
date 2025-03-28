import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Download, Eye, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function DocumentCard({ document, onView, onDownload, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await action();
    } catch (error) {
      console.error('Action error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{document.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={loading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction(onView)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction(onDownload)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction(onDelete)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge className={statusColors[document.status]}>
            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
          </Badge>
          <span className="text-sm text-gray-500">
            ID: {document.id.slice(0, 8)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Last updated: {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
      </CardFooter>
    </Card>
  );
}
