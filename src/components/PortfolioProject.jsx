
import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight, Code2, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PortfolioProject = ({ project, layoutVariants, onEdit, onDelete, isOwner }) => {
  return (
    <motion.div variants={layoutVariants} layout>
      <Card className="h-full bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 rounded-xl overflow-hidden group shadow-lg hover:shadow-purple-900/20 flex flex-col relative">
        {/* Action Buttons for Owner */}
        {isOwner && (
          <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 bg-black/70 backdrop-blur hover:bg-purple-600 hover:text-white border border-white/10"
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(project);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 bg-black/70 backdrop-blur hover:bg-red-600 hover:text-white border border-white/10"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(project.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Image Area */}
        <div className="relative h-48 overflow-hidden bg-black">
          {project.cover_image_url ? (
            <img 
              src={project.cover_image_url} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black">
              <Code2 className="w-12 h-12 text-gray-800" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />
          
          {/* Tags Overlay */}
          <div className="absolute bottom-3 left-3 flex gap-2 overflow-hidden max-w-[90%] flex-wrap">
            {project.tags && project.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-black/60 backdrop-blur-sm text-purple-300 border-purple-500/30 text-[10px] h-5 hover:bg-purple-900/40">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <CardHeader className="pb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          {project.project_date && (
            <span className="text-xs text-gray-500 font-mono">
              {new Date(project.project_date).getFullYear()}
            </span>
          )}
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
            {project.description || "No description available."}
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t border-gray-800 flex justify-between items-center bg-gray-950/30">
          <div className="flex gap-3">
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-full"
                title="View Source"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live_url && (
              <a 
                href={project.live_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-full"
                title="Live Demo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <Button asChild variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 -mr-2">
            <Link to={`/portfolio/${project.slug}`}>
              Details <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PortfolioProject;
