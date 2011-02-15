;; Matt Forbes
;; CS400 Artificial Intelligence Independant Study

;;;;; Problem: Traveling salesman problem solved using minimum
;;;;; spanning tree (MST) as as search heuristic.

;;;; TSP definition: starting at some initial city, C, visit every
;;;; other city exactly once, except for city C which is both the
;;;; first and the last city visited.

;;;; A relaxed version of the TSP that yields the MST heuristic would
;;;; be: find a graph which includes each city exactly once which is
;;;; based off a path of previously visited cities.

;;;; The MST heuristic dominates the straight-line heuristic; the MST
;;;; estimations are a subset of the straight-line estimations.

;;;; The graphs used in this version are points (x, y) that are
;;;; contained in square bounded by (x, 0, 1) (y, 0, 1). Each node
;;;; must have be a part of at least two edges or it would be
;;;; impossible to complete the problem.

;;;; A state is represented as (n path) where n is the current
;;;; position (node in the graph) and path is a list of previously
;;;; visited cities (in reverse order)


;;;; Nodes generated will be a part of between 2 and (2+max-branches) edges
(defparameter *max-branch* 3)

;;;; graph datastructure. composed of nodes (integers ranged 0 to n)
;;;; and a set of edges (a b) where a and b are connected nodes. 
(defstruct (graph (:conc-name nil))
  (nodes nil)
  (edges nil))

;;;; get the x,y location of a node within a graph
(defmacro node->pt (node graph)
  `(elt (nodes ,graph) ,node))

;;;;; successors - given a state and graph, return a list of all
;;;;; possible states we can get to from here
(defun successors (state graph) 
  (destructuring-bind (n path) state
    (let ((acc nil)
          (new-path (cons n path))
          (dest (car (last (cadr state))))
          (last-p (= (1- (length (nodes graph))) (length (cadr state)))))
      (mapcar #'(lambda (edge)
                  (cond ((and (= (car edge) n)
                              (or (and last-p (= (cadr edge) dest))
                                  (not (member (cadr edge) path))))
                         (push (list (cadr edge) new-path) acc))
                        ((and (= (cadr edge) n)
                              (or (and last-p (= (car edge) dest))
                                  (not (member (car edge) path))))
                         (push (list (car edge) new-path) acc))))
              (edges graph))
      acc)))
                

(defun a* (initial graph)
  (let ((size (length (nodes graph))))
    (do* ((state (list initial nil) (car expanded))
          (expanded (successors state graph) 
                    (sort (append (cdr expanded) (successors state graph))
                          #'< :key (rcurry #'eval-state graph))))
         ((or (null expanded) (= size (length (cadr state))))
          (unless (null expanded)
            (nreverse (cons (car state) (cadr state))))))))
      
(defun eval-state (state graph)
  (+ (mst (cadr state) graph)
     (dist (node->pt (car state) graph)
           (node->pt (car (cadr state)) graph))))

;;; minimum spanning tree - heuristic for A* search: return the total
;;; weight of the minimum spanning tree of the graph based off the
;;; given path
(defun mst (path graph)
  (let ((forest nil)
        (cost 0)
        (used nil)
        (added nil))
    ;; process path
    (maplist #'(lambda (lst)
                 (push (car lst) used)
                 (when (> (length lst) 1)
                   (incf cost (weight (subseq lst 0 2) graph))))
             path)
    (mapcar #'(lambda (node)
                (push (list node) forest))
            (filter (complement (rcurry #'member used))
                    (range (length (nodes graph)))))
    (when used (push used forest))
    ;; connect forests
    (do* ((es (sort-edges (edges graph) (rcurry #'weight graph)) (cdr es))
          (edge (car es) (car es)))
         ((or (null es)
              (eql 1 (length forest)))
          (if (eql 1 (length forest)) (values cost added)))
      (let ((t1 (member (car edge) forest :test #'member))
            (t2 (member (cadr edge) forest :test #'member)))
        (cond ((equal t1 t2))
              (t (push (append (car t1) (car t2)) forest)
                 (setf forest (remove (car t1) forest :test #'equal))
                 (setf forest (remove (car t2) forest :test #'equal))
                 (incf cost (weight edge graph))
                 (push edge added)))))))
        

;;;;; utilities

;;;; point functions
(defun pt (x y)
  (list x y))

(defun x (pt)
  (first pt))

(defun y (pt)
  (second pt))

;;;; rnd-pts - generate n random points over unit square
(defun rnd-pts (n)
  (let ((acc nil))
    (dotimes (i n)
      (push (pt (random 1.0) (random 1.0)) acc))
    acc))

;;;; gen-graph - build a graph with n nodes conforming to problem
;;;; constraints (points within unit square, 2 to max-branch edges per
;;;; node)
(defun gen-graph (n)
  (let ((ns (rnd-pts n))
        (es nil))
    (dotimes (i n)
      (dotimes (j (+ 2 (random *max-branch*)))
        (pushnew (list i (random n)) es :test #'edge-eql)))
    (make-graph :nodes ns :edges es)))
    
    
;;;; sort-edges - non-destructive sorting function. used for sorting
;;;; edges
(defun sort-edges (edges fn)
  (sort (copy-list edges)
        #'(lambda (e1 e2)
            (< (funcall fn e1) (funcall fn e2)))))

;;;; edge-eql - are two edges equal?
(defun edge-eql (e1 e2)
  (and (member (car e1) e2)
       (member (cadr e1) e2)))
  
;;;; just a square macro
(defmacro sq (n)
  (let ((sym (gensym)))
    `(let ((,sym ,n))
       (* ,sym ,sym))))
        
;;;; dist - distance between two points
(defun dist (p1 p2)
  (sqrt (+ (sq (- (y p2) (y p1)))
           (sq (- (x p2) (x p1))))))

;;;; weight - get weight of an edge
(defun weight (edge graph) 
  (dist (node->pt (car edge) graph)
        (node->pt (cadr edge) graph)))
  
;;;; range - return list of ints 0 ... (n-1)
(defun range (n)
  (let ((acc nil))
    (dotimes (i n)
      (push i acc))
    (nreverse acc)))

;;;; filter - return a list with all elements that pass the predicate
(defun filter (fn lst)
  (let ((acc nil))
    (dolist (obj lst)
      (when (funcall fn obj)
        (push obj acc)))
    (nreverse acc)))

;;;; curry - partially apply args to a function
(defun curry (fn &rest args)
  #'(lambda (&rest more-args)
      (apply fn (append args more-args))))

(defun rcurry (fn &rest args)
  #'(lambda (&rest more-args)
      (apply fn (append more-args args))))


;;;;; tests
(defparameter *test-graph*
  (make-graph
   :nodes '((0.0 0.6) (0.3 0.85)
            (0.25 0.2) (0.4 0.5) 
            (0.55 0.15) (0.7 0.7))
   :edges '((0 1) (0 2) (0 4) (0 5) (1 5) (2 4) (3 1) (3 5) (4 5))))

(defparameter *test-state*
  '(0 (5 4 2)))



  