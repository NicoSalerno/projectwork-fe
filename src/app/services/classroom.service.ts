import { inject, Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Classroom } from '../entities/classroom.entity';
import { User } from '../entities/user.entity';
import { Assignment } from '../entities/assignment.entity';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  protected http = inject(HttpClient);
  protected jwtSrv = inject(JwtService);
  protected router = inject(Router);
  protected authSrv = inject(AuthService);

  userList(role: string) {
    return this.http.get<any>('/api/users', {
      params: { type: role },
    });
  }

  createClassroom(name: string, students: string[] | User[]) {
    const payload = {
      name,
      students,
    };

    return this.http.post<any>('/api/classrooms', payload);
  }

  showClassrooms() {
    return this.http.get<Classroom[]>('/api/classrooms');
  }

  setAssignment(classroomId: string | Classroom, title: string) {
    const payload = {
      classroomId,
      title,
    };

    return this.http.post<Assignment>(
      `/api/classrooms/${classroomId}/assigments`,
      payload
    );
  }

  seeAssignment(classroomId: string | Classroom) {
    return this.http.get<Assignment[]>(
      `/api/classrooms/${classroomId}/assigments`
    );
  }

  setCompleted(classroomId: string, assignmentId: string) {
    return this.http.patch<Assignment>(
      `/api/classrooms/${classroomId}/assignments/${assignmentId}`,
      {}
    );
  }
}
