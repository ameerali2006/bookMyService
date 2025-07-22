import bcrypt from 'bcryptjs';
import { IHashService } from '../../interface/helpers/hash.interface';
import { injectable } from 'tsyringe';

@injectable()
export class HashService implements IHashService{
    async hash(password: string): Promise<string> {
        const saltRounds =10
        return await bcrypt.hash(password,saltRounds)
        
    }
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password,hashedPassword)
    }
}